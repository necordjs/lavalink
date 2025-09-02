import { Provider } from '@nestjs/common';
import { LavalinkManager, ManagerUtils } from 'lavalink-client';

export const LavalinkUtilsProvider: Provider<ManagerUtils> = {
	provide: ManagerUtils,
	useFactory: (lavalinkManager: LavalinkManager) => lavalinkManager.utils,
	inject: [LavalinkManager]
};
