import {
	ConfigurableModuleClass,
	LAVALINK_MODULE_OPTIONS
} from './necord-lavalink.module-definition';
import { Global, Logger, Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import * as ProvidersMap from './providers';
import { DiscoveryModule } from '@nestjs/core';
import { DestroyReasons, LavalinkManager } from 'lavalink-client';
import { Client } from 'discord.js';

const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: [...Providers],
	exports: [...Providers, LAVALINK_MODULE_OPTIONS]
})
export class NecordLavalinkModule
	extends ConfigurableModuleClass
	implements OnModuleInit, OnApplicationShutdown
{
	private readonly logger = new Logger(NecordLavalinkModule.name);

	public constructor(
		private readonly client: Client,
		private readonly lavalinkManager: LavalinkManager
	) {
		super();
	}

	public onModuleInit() {
		this.client.on('ready', async () => {
			await this.lavalinkManager.init({
				id: this.client.user.id,
				username: this.client.user.username
			});
		});

		this.client.on('raw', data => {
			this.lavalinkManager.sendRawData(data);
		});
	}

	public onApplicationShutdown() {
		this.logger.log('Shutting down Necord Lavalink Module');
		this.lavalinkManager.removeAllListeners();
		this.lavalinkManager.players.forEach(player => player.destroy(DestroyReasons.Disconnected));
		this.lavalinkManager.nodeManager.removeAllListeners();
		this.lavalinkManager.nodeManager.nodes.forEach(node =>
			node.destroy(DestroyReasons.NodeDestroy)
		);
	}
}
