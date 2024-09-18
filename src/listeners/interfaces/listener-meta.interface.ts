import { NecordLavalinkEvents } from './listener-events.interface';
import { LavalinkHostType, LavalinkListenerType } from '../enums';

export interface LavalinkListenerMeta {
	type: LavalinkListenerType;
	event: keyof NecordLavalinkEvents;
	host: LavalinkHostType;
}
