import { Test, TestingModule } from '@nestjs/testing';
import {
	LavalinkUtilsProvider,
	LavalinkManagerProvider,
	LavalinkNodeManagerProvider,
	PlayerManager,
	LAVALINK_MODULE_OPTIONS
} from '../../src';
import { LavalinkManager, ManagerUtils, NodeManager } from 'lavalink-client';
import { Client } from 'discord.js';

describe('Lavalink Providers', () => {
	const mockLavalink = {
		utils: Symbol('utils'),
		lavalinkManager: Symbol('lavalinkManager'),
		nodeManager: Symbol('nodeManager'),
		playerManager: Symbol('playerManager')
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
				password: 'youshallnotpass'
			}
		]
	};

	let moduleRef: TestingModule;

	beforeAll(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [
				{ provide: ManagerUtils, useValue: mockLavalink.utils },
				{ provide: LavalinkManager, useValue: mockLavalink.lavalinkManager },
				{ provide: NodeManager, useValue: mockLavalink.nodeManager },
				{ provide: PlayerManager, useValue: mockLavalink.playerManager },
				{ provide: Client, useValue: mockClient },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();
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
});
