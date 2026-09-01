import { Inject } from '@nestjs/common';

import {
	LAVALINK_MANAGER,
	LAVALINK_NODE_MANAGER,
	LAVALINK_UTILS,
	PlayerStore
} from '../constants/index.js';

/**
 * Injects the `LavalinkManager` instance.
 * @returns The parameter/property decorator.
 * @url https://necord.org/recipes/lavalink
 */
export const InjectLavalinkManager = () => Inject(LAVALINK_MANAGER);

/**
 * Injects the `NodeManager` instance.
 * @returns The parameter/property decorator.
 * @url https://necord.org/recipes/lavalink
 */
export const InjectNodeManager = () => Inject(LAVALINK_NODE_MANAGER);

/**
 * Injects the `ManagerUtils` instance.
 * @returns The parameter/property decorator.
 * @url https://necord.org/recipes/lavalink
 */
export const InjectManagerUtils = () => Inject(LAVALINK_UTILS);

/**
 * Injects the player store used by `autoResume`.
 * @returns The parameter/property decorator.
 * @url https://necord.org/recipes/lavalink
 */
export const InjectPlayerStore = () => Inject(PlayerStore);
