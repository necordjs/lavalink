import { Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { GuildShardPayload, LavalinkManager } from 'lavalink-client';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';
import { Client } from 'discord.js';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: (options: NecordLavalinkModuleOptions, client: Client) => {
		const sendToShard =
			options.sendToShard ??
			((guildId: string, packet: GuildShardPayload) => {
				client.guilds.cache.get(guildId)?.shard?.send(packet);
			});

		const clientOptions = options.client ?? {
			id: client.user.id,
			username: client.user.username
		};

		return new LavalinkManager({ ...options, sendToShard, client: clientOptions });
	},
	inject: [LAVALINK_MODULE_OPTIONS, Client]
};
