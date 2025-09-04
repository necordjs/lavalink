import { ManagerOptions, Player } from 'lavalink-client';
import { BaseStore } from './helpers';

export interface NecordLavalinkModuleOptions<T extends Player = Player>
	extends Omit<ManagerOptions, 'sendToShard'> {
	sendToShard?: ManagerOptions['sendToShard'];
	autoResume?: {
		playerStore: BaseStore;
		timer?: number;
	};
}
