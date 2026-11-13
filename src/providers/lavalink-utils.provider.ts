import { LavalinkManager, ManagerUtils } from 'lavalink-client';
import { Provider } from '@nestjs/common';

import { LAVALINK_MANAGER, LAVALINK_UTILS } from '../constants/index.js';

export const LavalinkUtilsProvider: Provider<ManagerUtils> = {
	provide: LAVALINK_UTILS,
	useFactory: (lavalinkManager: LavalinkManager) => lavalinkManager.utils,
	inject: [LAVALINK_MANAGER]
};
