import { Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { LavalinkManager, LavalinkNodeOptions, Player } from 'lavalink-client';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';
import { Client } from 'discord.js';
import { PlayerSaver } from '../helpers';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: async <T extends Player>(
		client: Client,
		options: NecordLavalinkModuleOptions<T>,
		playerSaver: PlayerSaver
	) => {
		let nodes: LavalinkNodeOptions[] = options.nodes;

		if (options.autoResume) {
			const sessions = await playerSaver.getSessions();
			nodes = options.nodes?.map(node => ({
				...node,
				session: sessions.get(node.id)
			}));
		}

		return new LavalinkManager<T>({
			...options,
			nodes,
			sendToShard: (guildId: string, payload: any) =>
				client.guilds.cache.get(guildId)?.shard?.send(payload)
		});
	},
	inject: [Client, LAVALINK_MODULE_OPTIONS, PlayerSaver]
};
