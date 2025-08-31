import { ManagerOptions, Player } from 'lavalink-client';
import { BaseStore } from './helpers';

export interface NecordLavalinkModuleOptions<T extends Player = Player>
	extends Omit<ManagerOptions<T>, 'sendToShard'> {
	sendToShard?: ManagerOptions<T>['sendToShard'];
	autoResume?: {
		playerStore: BaseStore;
		timer?: number;
	};
}
