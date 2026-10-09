import {
	LAVALINK_NODE_MANAGER,
	LAVALINK_MANAGER,
	LAVALINK_UTILS,
	PlayerStore
} from '../../src/constants/index.js';

describe('Injection tokens', () => {
	const tokens: [symbol, string][] = [
		[LAVALINK_MANAGER, 'NECORD_LAVALINK_MANAGER'],
		[LAVALINK_NODE_MANAGER, 'NECORD_LAVALINK_NODE_MANAGER'],
		[LAVALINK_UTILS, 'NECORD_LAVALINK_UTILS'],
		[PlayerStore, 'NECORD_LAVALINK_PLAYER_STORE']
	];

	it.each(tokens)('%p should be registered in the global symbol registry', (token, key) => {
		expect(Symbol.keyFor(token)).toBe(key);
	});

	it.each(tokens)('%p should be resolved by key, not by reference', (token, key) => {
		expect(Symbol.for(key)).toBe(token);
		expect(Symbol(key)).not.toBe(token);
	});

	it('should not share tokens between different keys', () => {
		const keys = tokens.map(([, key]) => key);

		expect(new Set(keys).size).toBe(keys.length);
	});
});
