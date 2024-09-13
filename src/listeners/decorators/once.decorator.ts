import { Listener } from 'necord';
import { LavalinkManagerEvents } from 'lavalink-client/dist/types/structures/Types/Manager';
import { NodeManagerEvents } from 'lavalink-client';

/**
 * Decorator that marks a method as a listener for Lavalink client.
 * @param event The event name.
 * @returns The decorated method.
 * @url https://necord.org/recipes/lavalink/listeners
 */
export const OnceLavalink = <K extends keyof E, E = LavalinkManagerEvents | NodeManagerEvents>(
	event: K
) => Listener({ type: 'once', event });
