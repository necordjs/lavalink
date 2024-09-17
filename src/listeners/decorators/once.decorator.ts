import { LavalinkListener } from './listener.decorator';
import { NecordLavalinkManagerEvents, NecordNodeManagerEvents } from '../interfaces';
import { LavalinkHostType, LavalinkListenerType } from '../enums';

/**
 * Decorator that marks a method as a listener for Lavalink client.
 * @param event The event name.
 * @returns The decorated method.
 * @url https://necord.org/recipes/lavalink/listeners
 */
export const OnceLavalinkManager = <K extends keyof NecordLavalinkManagerEvents>(event: K) =>
	LavalinkListener({
		type: LavalinkListenerType.Once,
		event,
		host: LavalinkHostType.LavalinkManager
	});

export const OnceNodeManager = <K extends keyof NecordNodeManagerEvents>(event: K) =>
	LavalinkListener({
		type: LavalinkListenerType.Once,
		event,
		host: LavalinkHostType.NodeManager
	});