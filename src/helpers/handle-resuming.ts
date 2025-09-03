import { Inject, Injectable, Logger } from '@nestjs/common';
import { LavalinkManager, NodeManager } from 'lavalink-client';
import { PlayerManager } from './player-manager';
import { Client } from 'discord.js';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';
import { PlayerStore } from '../constants';
import { BaseStore } from './base-store';
import { PlayerSaver } from './player-saver';

@Injectable()
export class ResumingHandler {
	public constructor(
		private readonly nodeManager: NodeManager,
		private readonly playerManager: PlayerManager,
		private readonly lavalinkManager: LavalinkManager,
		private readonly client: Client,
		private readonly playerSaver: PlayerSaver,
		@Inject(PlayerStore)
		private readonly store: BaseStore,
		@Inject(LAVALINK_MODULE_OPTIONS)
		private readonly lavalinkOptions: NecordLavalinkModuleOptions
	) {}

	private readonly logger = new Logger(ResumingHandler.name);

	public async resume() {
		this.lavalinkManager.on('playerCreate', async player => {
			await this.playerSaver.savePlayerOnCreate(player);
		});

		this.lavalinkManager.on('playerUpdate', async (oldPlayer, newPlayer) => {
			await this.playerSaver.savePlayerOnUpdate(oldPlayer, newPlayer);
		});

		this.lavalinkManager.on('playerDestroy', async (player, reason) => {
			await this.playerSaver.deletePlayer(player.guildId);
		});

		this.nodeManager.on('connect', async node => {
			await node.updateSession(true, this.lavalinkOptions.autoResume.timer ?? 360e3);
		});

		this.nodeManager.on('resumed', async (node, payload, players) => {
			if (!Array.isArray(players)) {
				this.logger.log(`Node: \`${node.id}\` has no players to resume`);
				return;
			}

			this.logger.log(`Node: \`${node.id}\` started resuming ${players.length} players`);

			for (const playerData of players) {
				const id = this.playerSaver.transformId(playerData.guildId);
				const savedPlayer = await this.store.get(id);

				if (!playerData.state.connected) {
					await this.store.delete(id);
				}

				const player = this.playerManager.create({
					guildId: playerData.guildId,
					voiceChannelId: savedPlayer.voiceChannelId,
					textChannelId: savedPlayer.textChannelId,
					selfDeaf: savedPlayer.options?.selfDeaf || true,
					selfMute: savedPlayer.options?.selfMute || false,
					volume: this.lavalinkOptions.playerOptions?.volumeDecrementer
						? Math.round(
								playerData.volume /
									this.lavalinkOptions.playerOptions.volumeDecrementer
							)
						: playerData.volume,
					node: node.id,
					applyVolumeAsFilter: savedPlayer.options.applyVolumeAsFilter,
					instaUpdateFiltersFix: savedPlayer.options.instaUpdateFiltersFix,
					vcRegion: savedPlayer.options.vcRegion
				});

				await player.connect();

				player.filterManager.data = playerData.filters;
				await player.queue.utils.sync(true, false).catch(console.warn);
				if (playerData.track)
					player.queue.current = this.lavalinkManager.utils.buildTrack(
						playerData.track,

						player.queue.current?.requester || this.client.user
					);
				player.lastPosition = playerData.state.position;
				player.lastPositionChange = Date.now();
				player.ping.lavalink = playerData.state.ping;
				player.paused = playerData.paused;
				player.playing = !playerData.paused && !!playerData.track;
			}

			this.logger.log(`Node: \`${node.id}\` finished resuming ${players.length} players`);
		});
	}
}
