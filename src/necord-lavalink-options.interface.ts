import { ManagerOptions } from 'lavalink-client';

export interface NecordLavalinkModuleOptions
	extends Omit<ManagerOptions, 'sendToShard' | 'client'> {}
