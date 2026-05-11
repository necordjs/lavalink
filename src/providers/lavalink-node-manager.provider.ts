import { LavalinkManager, NodeManager } from 'lavalink-client';
import { Provider } from '@nestjs/common';

export const LavalinkNodeManagerProvider: Provider<NodeManager> = {
	provide: NodeManager,
	useFactory: (lavalinkManager: LavalinkManager) => lavalinkManager.nodeManager,
	inject: [LavalinkManager]
};
