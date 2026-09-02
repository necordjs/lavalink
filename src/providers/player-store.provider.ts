import { Provider } from '@nestjs/common';

import { NecordLavalinkModuleOptions } from '../necord-lavalink-options.interface.js';
import { LAVALINK_MODULE_OPTIONS } from '../necord-lavalink.module-definition.js';
import { PlayerStore } from '../constants/index.js';
import { BaseStore } from '../helpers/index.js';

export const PlayerStoreProvider: Provider<BaseStore | undefined> = {
	provide: PlayerStore,
	useFactory: (options: NecordLavalinkModuleOptions) => options.autoResume?.playerStore,
	inject: [LAVALINK_MODULE_OPTIONS]
};
