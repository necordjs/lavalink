import { Test, TestingModule } from '@nestjs/testing';

import { PlayerStoreProvider } from '../../src/providers/player-store.provider.js';
import { LAVALINK_MODULE_OPTIONS } from '../../src/index.js';
import { PlayerStore } from '../../src/constants/index.js';

describe('PlayerStoreProvider', () => {
	let moduleRef: TestingModule;

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should return playerStore when autoResume and playerStore are provided', async () => {
		const mockPlayerStore = {
			get: vi.fn<(...args: any[]) => any>(),
			save: vi.fn<(...args: any[]) => any>()
		};
		const mockOptions = {
			nodes: [],
			autoResume: {
				playerStore: mockPlayerStore
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				PlayerStoreProvider,
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();

		const playerStore = moduleRef.get(PlayerStore);
		expect(playerStore).toBe(mockPlayerStore);
	});

	it('should return undefined when autoResume is not provided', async () => {
		const mockOptions = {
			nodes: []
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				PlayerStoreProvider,
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();

		const playerStore = moduleRef.get(PlayerStore);
		expect(playerStore).toBeUndefined();
	});

	it('should return undefined when autoResume exists but playerStore is not provided', async () => {
		const mockOptions = {
			nodes: [],
			autoResume: {
				timer: 360000
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				PlayerStoreProvider,
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();

		const playerStore = moduleRef.get(PlayerStore);
		expect(playerStore).toBeUndefined();
	});

	it('should return undefined when autoResume is null', async () => {
		const mockOptions = {
			nodes: [],
			autoResume: null
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				PlayerStoreProvider,
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();

		const playerStore = moduleRef.get(PlayerStore);
		expect(playerStore).toBeUndefined();
	});
});
