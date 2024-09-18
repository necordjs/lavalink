import { Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { LavalinkManager } from 'lavalink-client';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';
import { Client } from 'discord.js';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: async (client: Client, options: NecordLavalinkModuleOptions) => {
		return new LavalinkManager({
			sendToShard: (guildId: string, payload: any) =>
				client.guilds.cache.get(guildId)?.shard?.send(payload),
			...options
		});
	},
	inject: [Client, LAVALINK_MODULE_OPTIONS]
};
