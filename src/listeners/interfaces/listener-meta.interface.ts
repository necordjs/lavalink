import { LavalinkHostType, LavalinkListenerType } from '../enums/index.js';
import { NecordLavalinkEvents } from './listener-events.interface.js';

export interface LavalinkListenerMeta {
	type: LavalinkListenerType;
	event: keyof NecordLavalinkEvents;
	host: LavalinkHostType;
}
