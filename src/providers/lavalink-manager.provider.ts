import { Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { LavalinkManager } from 'lavalink-client';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: (options: NecordLavalinkModuleOptions) => new LavalinkManager(options),
	inject: [LAVALINK_MODULE_OPTIONS]
};
