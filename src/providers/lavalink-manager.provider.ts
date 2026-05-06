import { Logger, Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { LavalinkManager } from 'lavalink-client';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';
import { Client } from 'discord.js';
import { PlayerSaverService } from '../services';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: async (
		client: Client,
		options: NecordLavalinkModuleOptions,
		playerSaver: PlayerSaverService
	) => {
		const nodes = options.nodes;

		if (options.autoResume && nodes?.length > 0) {
			const sessions = await playerSaver.getSessions();

			for (const node of nodes) {
				node.sessionId = sessions.get(node.id);
			}
		}

		return new LavalinkManager({
			...options,
			nodes,
			sendToShard: (guildId: string, payload: any) =>
				client.guilds.cache.get(guildId)?.shard?.send(payload)
		});
	},
	inject: [Client, LAVALINK_MODULE_OPTIONS, PlayerSaverService]
};
