import {
	ConfigurableModuleClass,
	LAVALINK_MODULE_OPTIONS
} from './necord-lavalink.module-definition';
import {
	Global,
	Inject,
	Logger,
	Module,
	OnApplicationShutdown,
	OnModuleInit
} from '@nestjs/common';
import * as ProvidersMap from './providers';
import { DestroyReasons, LavalinkManager } from 'lavalink-client';
import { Client } from 'discord.js';
import { LavalinkListenersModule } from './listeners';
import { NecordLavalinkModuleOptions } from './necord-lavalink-options.interface';

const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	imports: [LavalinkListenersModule],
	providers: Providers,
	exports: Providers
})
export class NecordLavalinkModule
	extends ConfigurableModuleClass
	implements OnModuleInit, OnApplicationShutdown
{
	private readonly logger = new Logger(NecordLavalinkModule.name);

	public constructor(
		private readonly client: Client,
		private readonly lavalinkManager: LavalinkManager,
		@Inject(LAVALINK_MODULE_OPTIONS)
		private readonly options: NecordLavalinkModuleOptions
	) {
		super();
	}

	public onModuleInit() {
		this.client.on('ready', async () => {
			await this.lavalinkManager.init(
				this.options.client ?? {
					id: this.client.user.id,
					username: this.client.user.username
				}
			);

			this.logger.log('Lavalink Manager Initialized');
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
