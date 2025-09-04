import { Test, TestingModule } from '@nestjs/testing';
import { LavalinkManager } from 'lavalink-client';
import { Client } from 'discord.js';
import { LavalinkManagerProvider } from '../../src/providers/lavalink-manager.provider';
import { LAVALINK_MODULE_OPTIONS, PlayerSaverService } from '../../src';

describe('LavalinkManagerProvider', () => {
	let moduleRef: TestingModule;

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

	const mockPlayerSaver = {
		getSessions: jest.fn()
	};

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should create LavalinkManager without autoResume', async () => {
		const mockOptions = {
			nodes: [
				{
					id: 'node1',
					host: 'localhost',
					port: 2333,
					authorization: 'password'
				}
			]
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkManagerProvider,
				{ provide: Client, useValue: mockClient },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions },
				{ provide: PlayerSaverService, useValue: mockPlayerSaver }
			]
		}).compile();

		const lavalinkManager = moduleRef.get<LavalinkManager>(LavalinkManager);
		expect(lavalinkManager).toBeInstanceOf(LavalinkManager);
		expect(mockPlayerSaver.getSessions).not.toHaveBeenCalled();
	});

	it('should create LavalinkManager with autoResume and add sessions to nodes', async () => {
		const mockSessions = new Map([['node1', 'session123']]);
		mockPlayerSaver.getSessions.mockResolvedValue(mockSessions);

		const mockOptions = {
			nodes: [
				{
					id: 'node1',
					host: 'localhost',
					port: 2333,
					authorization: 'password'
				}
			],
			autoResume: {
				timer: 360000
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkManagerProvider,
				{ provide: Client, useValue: mockClient },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions },
				{ provide: PlayerSaverService, useValue: mockPlayerSaver }
			]
		}).compile();

		const lavalinkManager = moduleRef.get<LavalinkManager>(LavalinkManager);
		expect(lavalinkManager).toBeInstanceOf(LavalinkManager);
		expect(mockPlayerSaver.getSessions).toHaveBeenCalled();
	});

	it('should handle autoResume with empty sessions', async () => {
		const mockSessions = new Map();
		mockPlayerSaver.getSessions.mockResolvedValue(mockSessions);

		const mockOptions = {
			nodes: [
				{
					id: 'node1',
					host: 'localhost',
					port: 2333,
					authorization: 'password'
				}
			],
			autoResume: {
				timer: 360000
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkManagerProvider,
				{ provide: Client, useValue: mockClient },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions },
				{ provide: PlayerSaverService, useValue: mockPlayerSaver }
			]
		}).compile();

		const lavalinkManager = moduleRef.get<LavalinkManager>(LavalinkManager);
		expect(lavalinkManager).toBeInstanceOf(LavalinkManager);
		expect(mockPlayerSaver.getSessions).toHaveBeenCalled();
	});

	it('should handle autoResume with multiple nodes and sessions', async () => {
		const mockSessions = new Map([
			['node1', 'session123'],
			['node2', 'session456']
		]);
		mockPlayerSaver.getSessions.mockResolvedValue(mockSessions);

		const mockOptions = {
			nodes: [
				{
					id: 'node1',
					host: 'localhost',
					port: 2333,
					authorization: 'password'
				},
				{
					id: 'node2',
					host: 'localhost',
					port: 2334,
					authorization: 'password'
				}
			],
			autoResume: {
				timer: 360000
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkManagerProvider,
				{ provide: Client, useValue: mockClient },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions },
				{ provide: PlayerSaverService, useValue: mockPlayerSaver }
			]
		}).compile();

		const lavalinkManager = moduleRef.get<LavalinkManager>(LavalinkManager);
		expect(lavalinkManager).toBeInstanceOf(LavalinkManager);
		expect(mockPlayerSaver.getSessions).toHaveBeenCalled();
	});

	it('should throw error when nodes is undefined with autoResume', async () => {
		const mockSessions = new Map();
		mockPlayerSaver.getSessions.mockResolvedValue(mockSessions);

		const mockOptions = {
			nodes: undefined,
			autoResume: {
				timer: 360000
			}
		};

		let errorThrown = false;
		let errorMessage = '';

		try {
			moduleRef = await Test.createTestingModule({
				providers: [
					LavalinkManagerProvider,
					{ provide: Client, useValue: mockClient },
					{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions },
					{ provide: PlayerSaverService, useValue: mockPlayerSaver }
				]
			}).compile();
		} catch (error) {
			errorThrown = true;
			errorMessage = error.message;
		}

		expect(errorThrown).toBe(true);
		expect(errorMessage).toContain(
			'ManagerOption.nodes must be an Array of NodeOptions and is required of at least 1 Node'
		);
		expect(mockPlayerSaver.getSessions).toHaveBeenCalled();
	});
});
