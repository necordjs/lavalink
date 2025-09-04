import { Provider } from '@nestjs/common';
import { PlayerStore } from '../constants';
import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition';
import { BaseStore } from '../helpers';

export const PlayerStoreProvider: Provider<BaseStore> = {
	provide: PlayerStore,
	useFactory: (options: NecordLavalinkModuleOptions) => options.autoResume?.playerStore,
	inject: [LAVALINK_MODULE_OPTIONS]
};
