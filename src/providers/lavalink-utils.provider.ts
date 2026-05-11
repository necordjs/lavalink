import { LavalinkManager, ManagerUtils } from 'lavalink-client';
import { Provider } from '@nestjs/common';

export const LavalinkUtilsProvider: Provider<ManagerUtils> = {
	provide: ManagerUtils,
	useFactory: (lavalinkManager: LavalinkManager) => lavalinkManager.utils,
	inject: [LavalinkManager]
};
