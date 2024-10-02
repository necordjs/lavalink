import { LavalinkListener } from './listener.decorator';
import { LavalinkHostType, LavalinkListenerType } from '../enums';
import { NecordLavalinkManagerEvents, NecordNodeManagerEvents } from '../interfaces';

/**
 * Decorator that marks a method as a listener for Lavalink client.
 * @param event The event name.
 * @returns The decorated method.
 * @url https://necord.org/recipes/lavalink/#listeners
 */
export const OnLavalinkManager = <K extends keyof NecordLavalinkManagerEvents>(event: K) =>
	LavalinkListener({
		type: LavalinkListenerType.On,
		event,
		host: LavalinkHostType.LavalinkManager
	});

/**
 * Decorator that marks a method as a listener for Lavalink client.
 * @param event The event name.
 * @returns The decorated method.
 * @url https://necord.org/recipes/lavalink/#listeners
 */
export const OnNodeManager = <K extends keyof NecordNodeManagerEvents>(event: K) =>
	LavalinkListener({ type: LavalinkListenerType.On, event, host: LavalinkHostType.NodeManager });
