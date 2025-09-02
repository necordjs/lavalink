import { Provider } from '@nestjs/common';
import { LavalinkManager, NodeManager } from 'lavalink-client';

export const LavalinkNodeManagerProvider: Provider<NodeManager> = {
	provide: NodeManager,
	useFactory: (lavalinkManager: LavalinkManager) => lavalinkManager.nodeManager,
	inject: [LavalinkManager]
};
