import { Provider } from '@nestjs/common';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { LavalinkManager } from 'lavalink-client';
import { ManagerOptions } from 'lavalink-client/dist/types/structures/Types/Manager';

export const LavalinkManagerProvider: Provider<LavalinkManager> = {
	provide: LavalinkManager,
	useFactory: (options: ManagerOptions) => new LavalinkManager(options),
	inject: [LAVALINK_MODULE_OPTIONS]
};
