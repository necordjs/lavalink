import { Listener } from './listener.decorator';
import { NecordLavalinkEvents } from '../listener.interface';

/**
 * Decorator that marks a method as a listener for Lavalink client.
 * @param event The event name.
 * @returns The decorated method.
 * @url https://necord.org/recipes/lavalink/listeners
 */
export const OnLavalink = <K extends keyof NecordLavalinkEvents>(event: K) =>
	Listener({ type: 'on', event });
