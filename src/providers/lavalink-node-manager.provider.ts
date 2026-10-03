import { LavalinkManager, NodeManager } from 'lavalink-client';
import { Provider } from '@nestjs/common';

import { LAVALINK_MANAGER, LAVALINK_NODE_MANAGER } from '../constants/index.js';

export const LavalinkNodeManagerProvider: Provider<NodeManager> = {
	provide: LAVALINK_NODE_MANAGER,
	useFactory: (lavalinkManager: LavalinkManager) => lavalinkManager.nodeManager,
	inject: [LAVALINK_MANAGER]
};
