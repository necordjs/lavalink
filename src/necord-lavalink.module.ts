import {
	Global,
	Inject,
	Logger,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown,
	OnModuleInit
} from '@nestjs/common';
import * as ProvidersMap from './providers';
import { BotClientOptions, DestroyReasons, LavalinkManager, NodeManager } from 'lavalink-client';
import { Client } from 'discord.js';
import {
	ConfigurableModuleClass,
	LAVALINK_MODULE_OPTIONS
} from './necord-lavalink.module-definition';
import { LavalinkListenersModule } from './listeners';
import { NecordLavalinkModuleOptions } from './necord-lavalink-options.interface';
import { NecordLavalinkService } from './necord-lavalink.service';
import { PlayerSaver, ResumingHandler } from './helpers';

const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	imports: [LavalinkListenersModule],
	providers: [NecordLavalinkService, PlayerSaver, ...Providers],
	exports: [NecordLavalinkService, ...Providers, LAVALINK_MODULE_OPTIONS]
})
export class NecordLavalinkModule
	extends ConfigurableModuleClass
	implements OnModuleInit, OnApplicationShutdown, OnApplicationBootstrap
{
	private readonly logger = new Logger(NecordLavalinkModule.name);

	public constructor(
		private readonly client: Client,
		private readonly lavalinkManager: LavalinkManager,
		private readonly nodeManager: NodeManager,
		@Inject(LAVALINK_MODULE_OPTIONS)
		private readonly options: NecordLavalinkModuleOptions,
		private readonly resumingHandler: ResumingHandler
	) {
		super();
	}


	public onModuleInit() {
		return this.client
			.once('clientReady', async () => {
				await this.lavalinkManager.init(this.getClientOptions());

				this.logger.log('Lavalink Manager Initialized');
			})
			.on('raw', data => this.lavalinkManager.sendRawData(data));
	}

	public async onApplicationBootstrap() {
		if (this.options.autoResume) {
			await this.resumingHandler.resume();
		}
	}

	public onApplicationShutdown() {
		this.logger.log('Shutting down Necord Lavalink Module');
		this.lavalinkManager.removeAllListeners();
		this.lavalinkManager.players.forEach(player => player.destroy(DestroyReasons.Disconnected));

		this.nodeManager.removeAllListeners();
		this.nodeManager.nodes.forEach(node => node.destroy(DestroyReasons.NodeDestroy));
	}

	private getClientOptions(): BotClientOptions {
		return (
			this.options.client ?? {
				id: this.client.user.id,
				username: this.client.user.username
			}
		);
	}
}
