import { ManagerOptions } from 'lavalink-client';
import { BaseStore } from './helpers';

export interface NecordLavalinkModuleOptions extends Omit<ManagerOptions, 'sendToShard'> {
	sendToShard?: ManagerOptions['sendToShard'];
	onApplicationShutdown?: {
		destroyPlayers?: boolean;
		destroyNodes?: boolean;
	};
	autoResume?: {
		playerStore: BaseStore;
		timer?: number;
	};
}
