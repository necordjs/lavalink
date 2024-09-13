import { Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { GuildShardPayload, LavalinkManager } from 'lavalink-client';
import { Client } from 'discord.js';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: (options: NecordLavalinkModuleOptions, client: Client) =>
		new LavalinkManager({
			...options,
			sendToShard: (guildId: string, payload: GuildShardPayload) =>
				client.guilds.cache.get(guildId)?.shard?.send(payload),
			client: {
				id: client.user.id,
				username: client.user.username
			}
		}),
	inject: [LAVALINK_MODULE_OPTIONS, Client]
};
