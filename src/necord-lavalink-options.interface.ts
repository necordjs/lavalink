import { ManagerOptions } from 'lavalink-client';
import { BaseStore } from './helpers';

export interface NecordLavalinkModuleOptions extends Omit<ManagerOptions, 'sendToShard'> {
	sendToShard?: ManagerOptions['sendToShard'];
	gracefulShutdown?: {
		destroyPlayers?: boolean;
		destroyNodes?: boolean;
	};
	autoResume?: {
		playerStore: BaseStore;
		timer?: number;
		autoSyncQueue?: boolean;
	};
}
