import { Test, TestingModule } from '@nestjs/testing';
import {
	PlayerManager,
	PlayerSaver,
	LAVALINK_MODULE_OPTIONS,
	LavalinkManagerProvider,
	LavalinkUtilsProvider,
	LavalinkNodeManagerProvider,
	PlayerSaverProvider,
	PlayerStoreProvider
} from '../../src';
import { LavalinkManager, ManagerUtils, NodeManager } from 'lavalink-client';
import { Client } from 'discord.js';
import { PlayerStore } from '../../src/constants';

describe('Lavalink Providers', () => {
	const mockLavalink = {
		utils: Symbol('utils'),
		lavalinkManager: Symbol('lavalinkManager'),
		nodeManager: Symbol('nodeManager'),
		playerManager: Symbol('playerManager'),
		playerSaver: Symbol('playerSaver')
	};

	const mockPlayerStore = {
		get: jest.fn(),
		save: jest.fn(),
		delete: jest.fn(),
		getAll: jest.fn().mockResolvedValue([])
	};

	const mockClient = {
		guilds: {
			cache: new Map([
				[
					'123',
					{
						shard: {
							send: jest.fn()
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
				{ provide: ManagerUtils, useValue: mockLavalink.utils },
				{ provide: LavalinkManager, useValue: mockLavalink.lavalinkManager },
				{ provide: NodeManager, useValue: mockLavalink.nodeManager },
				{ provide: PlayerManager, useValue: mockLavalink.playerManager },
				{ provide: PlayerSaver, useValue: mockLavalink.playerSaver },
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
		const utils = moduleRef.get<ManagerUtils>(ManagerUtils);
		expect(utils).toBe(mockLavalink.utils);
	});

	it('should provide the LavalinkManager instance from Lavalink', () => {
		const manager = moduleRef.get<LavalinkManager>(LavalinkManager);
		expect(manager).toBe(mockLavalink.lavalinkManager);
	});

	it('should provide the LavalinkNodeManager instance from Lavalink', () => {
		const nodeManager = moduleRef.get<NodeManager>(NodeManager);
		expect(nodeManager).toBe(mockLavalink.nodeManager);
	});

	it('should provide the PlayerManager instance from Lavalink', () => {
		const playerManager = moduleRef.get<PlayerManager>(PlayerManager);
		expect(playerManager).toBe(mockLavalink.playerManager);
	});

	it('should provide the PlayerSaver instance', () => {
		const playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBe(mockLavalink.playerSaver);
	});

	it('should provide the PlayerStore instance', () => {
		const playerStore = moduleRef.get(PlayerStore);
		expect(playerStore).toBe(mockPlayerStore);
	});
});
