import {
	Global,
	Inject,
	Logger,
	Module,
	OnApplicationShutdown,
	OnModuleInit
} from '@nestjs/common';
import * as ProvidersMap from './providers';
import { BotClientOptions, LavalinkManager, NodeManager } from 'lavalink-client';
import { Client } from 'discord.js';
import {
	ConfigurableModuleClass,
	LAVALINK_MODULE_OPTIONS
} from './necord-lavalink.module-definition';
import { LavalinkListenersModule } from './listeners';
import { NecordLavalinkModuleOptions } from './necord-lavalink-options.interface';
import { NecordLavalinkService } from './necord-lavalink.service';
import * as ServicesMap from './services';

const Services = Object.values(ServicesMap);
const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	imports: [LavalinkListenersModule],
	providers: [NecordLavalinkService, ...Services, ...Providers],
	exports: [NecordLavalinkService, ...Services, ...Providers, LAVALINK_MODULE_OPTIONS]
})
export class NecordLavalinkModule
	extends ConfigurableModuleClass
	implements OnModuleInit, OnApplicationShutdown
{
	private readonly logger = new Logger(NecordLavalinkModule.name);

	public constructor(
		private readonly client: Client,
		private readonly lavalinkManager: LavalinkManager,
		private readonly nodeManager: NodeManager,
		@Inject(LAVALINK_MODULE_OPTIONS)
		private readonly options: NecordLavalinkModuleOptions
	) {
		super();

		this.options.gracefulShutdown = {
			destroyPlayers: this.options.gracefulShutdown?.destroyPlayers ?? true,
			destroyNodes: this.options.gracefulShutdown?.destroyNodes ?? true
		};
	}

	public onModuleInit() {
		return this.client
			.once('clientReady', async () => {
				await this.lavalinkManager.init(this.getClientOptions());

				this.logger.log('Lavalink Manager Initialized');
			})
			.on('raw', data => this.lavalinkManager.sendRawData(data));
	}

	public onApplicationShutdown() {
		if (this.options.gracefulShutdown) {
			this.logger.log('Shutting down Necord Lavalink Module');

			if (
				this.options.autoResume &&
				(this.options.gracefulShutdown.destroyPlayers ||
					this.options.gracefulShutdown.destroyNodes)
			) {
				this.logger.warn(
					'Using autoResume and onApplicationShutdown with destructive shutdown options (destroyPlayers or destroyNodes) can cause issues to resume players'
				);
			}
		}

		if (this.options.gracefulShutdown?.destroyPlayers) {
			this.logger.log('Destroying all players');
			this.lavalinkManager.players.forEach(player => player.destroy('ApplicationShutdown'));
		}

		if (this.options.gracefulShutdown?.destroyNodes) {
			this.logger.log('Destroying all nodes');
			this.nodeManager.nodes.forEach(node => node.destroy('ApplicationShutdown'));
		}
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
