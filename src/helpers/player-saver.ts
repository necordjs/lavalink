import { Player, PlayerJson } from 'lavalink-client';
import { BaseStore } from './base-store';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlayerStore } from '../constants';

@Injectable()
export class PlayerSaver {
	public constructor(@Inject(PlayerStore) private readonly store: BaseStore) {}

	private readonly logger = new Logger(PlayerSaver.name);

	public async savePlayerOnUpdate(oldPlayer: PlayerJson, newPlayer: Player): Promise<void> {
		const newPlayerData = newPlayer.toJSON();
		function normalize(obj: unknown) {
			return JSON.stringify(obj, Object.keys(obj).sort());
		}

		if (!oldPlayer || normalize(oldPlayer) !== normalize(newPlayerData)) {
			const id = this.transformId(newPlayerData.guildId);
			await this.store.save(id, JSON.stringify(newPlayerData));
		}
	}

	public async savePlayerOnCreate(player: Player): Promise<void> {
		const playerData = player.toJSON();
		const id = this.transformId(playerData.guildId);
		await this.store.save(id, JSON.stringify(playerData));
	}

	public async deletePlayer(guildId: string): Promise<void> {
		const id = this.transformId(guildId);
		await this.store.delete(id);
	}

	public async getSessions(): Promise<Map<string, string>> {
		const sessions = new Map<string, string>();

		const players = await this.store.getAll();

		if (players.length === 0) return new Map();

		try {
			for (const player of players) {
				if (!player.value) {
					continue;
				}
				const rawValue = Buffer.isBuffer(player.value)
					? player.value.toString('utf-8')
					: player.value;

				const playerObj = JSON.parse(rawValue) as PlayerJson;

				if (playerObj.nodeSessionId && playerObj.nodeId) {
					sessions.set(playerObj.nodeId, playerObj.nodeSessionId);
				}
			}
		} catch (error) {
			this.logger.error('Error fetching saved player sessions', error);
			return new Map();
		}

		return sessions;
	}

	public transformId(guildId: string): string {
		return `player:${guildId}`;
	}
}
