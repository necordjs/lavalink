import { LavalinkManager, ManagerUtils, NodeManager } from 'lavalink-client';
import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'discord.js';

import {
	LAVALINK_MANAGER,
	LAVALINK_NODE_MANAGER,
	LAVALINK_UTILS,
	PlayerStore
} from '../../src/constants/index.js';
import {
	PlayerManagerService,
	PlayerSaverService,
	LAVALINK_MODULE_OPTIONS
} from '../../src/index.js';

describe('Lavalink Providers', () => {
	const mockLavalink = {
		utils: Symbol('utils'),
		lavalinkManager: Symbol('lavalinkManager'),
		nodeManager: Symbol('nodeManager'),
		playerManager: Symbol('playerManager'),
		playerSaver: Symbol('playerSaver')
	};

	const mockPlayerStore = {
		get: vi.fn<(...args: any[]) => any>(),
		save: vi.fn<(...args: any[]) => any>(),
		delete: vi.fn<(...args: any[]) => any>(),
		getAll: vi.fn<(...args: any[]) => any>().mockResolvedValue([])
	};

	const mockClient = {
		guilds: {
			cache: new Map([
				[
					'123',
					{
						shard: {
							send: vi.fn<(...args: any[]) => any>()
						}
					}
				]
			])
		}
	} as unknown as Client;

	const mockOptions = {
		nodes: [
			{
				id: '1',
				host: 'localhost',
				port: 2333,
				authorization: 'youshallnotpass'
			}
		],
		autoResume: {
			playerStore: mockPlayerStore
		}
	};

	let moduleRef: TestingModule;

	beforeAll(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [
				{ provide: LAVALINK_UTILS, useValue: mockLavalink.utils },
				{ provide: LAVALINK_MANAGER, useValue: mockLavalink.lavalinkManager },
				{ provide: LAVALINK_NODE_MANAGER, useValue: mockLavalink.nodeManager },
				{ provide: PlayerManagerService, useValue: mockLavalink.playerManager },
				{ provide: PlayerSaverService, useValue: mockLavalink.playerSaver },
				{ provide: PlayerStore, useValue: mockPlayerStore },
				{ provide: Client, useValue: mockClient },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();
	});

	afterAll(async () => {
		await moduleRef.close();
	});

	it('should provide the LavalinkUtils instance from Lavalink', () => {
		const utils = moduleRef.get<ManagerUtils>(LAVALINK_UTILS);
		expect(utils).toBe(mockLavalink.utils);
	});

	it('should provide the LavalinkManager instance from Lavalink', () => {
		const manager = moduleRef.get<LavalinkManager>(LAVALINK_MANAGER);
		expect(manager).toBe(mockLavalink.lavalinkManager);
	});

	it('should provide the LavalinkNodeManager instance from Lavalink', () => {
		const nodeManager = moduleRef.get<NodeManager>(LAVALINK_NODE_MANAGER);
		expect(nodeManager).toBe(mockLavalink.nodeManager);
	});

	it('should provide the PlayerManager instance from Lavalink', () => {
		const playerManager = moduleRef.get<PlayerManagerService>(PlayerManagerService);
		expect(playerManager).toBe(mockLavalink.playerManager);
	});

	it('should provide the PlayerSaver instance', () => {
		const playerSaver = moduleRef.get<PlayerSaverService>(PlayerSaverService);
		expect(playerSaver).toBe(mockLavalink.playerSaver);
	});

	it('should provide the PlayerStore instance', () => {
		const playerStore = moduleRef.get(PlayerStore);
		expect(playerStore).toBe(mockPlayerStore);
	});
});
