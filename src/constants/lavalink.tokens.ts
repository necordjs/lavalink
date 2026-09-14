/**
 * Injection token for the `LavalinkManager` instance.
 *
 * Tokens are created through the global symbol registry (`Symbol.for`) so they
 * are resolved by key instead of by reference. This keeps injection working even
 * when `lavalink-client` or this package is loaded in more than one module
 * format (CJS and ESM), which would otherwise produce two distinct tokens.
 * @url https://necord.org/recipes/lavalink
 */
export const LAVALINK_MANAGER = Symbol.for('NECORD_LAVALINK_MANAGER');

/**
 * Injection token for the `NodeManager` instance.
 * @url https://necord.org/recipes/lavalink
 */
export const LAVALINK_NODE_MANAGER = Symbol.for('NECORD_LAVALINK_NODE_MANAGER');

/**
 * Injection token for the `ManagerUtils` instance.
 * @url https://necord.org/recipes/lavalink
 */
export const LAVALINK_UTILS = Symbol.for('NECORD_LAVALINK_UTILS');
