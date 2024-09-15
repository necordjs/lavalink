import { ManagerOptions } from 'lavalink-client';

export interface NecordLavalinkModuleOptions extends Omit<ManagerOptions, 'sendToShard'> {
	sendToShard?: ManagerOptions['sendToShard'];
}
