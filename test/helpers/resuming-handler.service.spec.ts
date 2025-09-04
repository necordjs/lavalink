import { Test, TestingModule } from '@nestjs/testing';
import { ResumingHandler, PlayerManager, PlayerSaver } from '../../src/services';
import { LavalinkManager, NodeManager, Player } from 'lavalink-client';
import { Client } from 'discord.js';
import { LAVALINK_MODULE_OPTIONS } from '../../src/necord-lavalink.module-definition';
import { PlayerStore } from '../../src/constants';

describe('ResumingHandler', () => {
	let moduleRef: TestingModule;
	let resumingHandler: ResumingHandler;
	let mockNodeManager: any;
	let mockPlayerManager: any;
	let mockLavalinkManager: any;
	let mockClient: any;
	let mockPlayerSaver: any;
	let mockStore: any;
	let mockOptions: any;

	beforeEach(async () => {
		mockNodeManager = {
			on: jest.fn()
		};

		mockPlayerManager = {
			create: jest.fn()
		};

		mockLavalinkManager = {
			on: jest.fn(),
			utils: {
				buildTrack: jest.fn()
			}
		};

		mockClient = {
			user: { id: 'bot123' }
		};

		mockPlayerSaver = {
			savePlayerOnCreate: jest.fn(),
			savePlayerOnUpdate: jest.fn(),
			deletePlayer: jest.fn(),
			transformId: jest.fn().mockReturnValue('player:guild1')
		};

		mockStore = {
			get: jest.fn(),
			delete: jest.fn()
		};

		mockOptions = {
			autoResume: {
				timer: 300000
			},
			playerOptions: {
				volumeDecrementer: 1
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				ResumingHandler,
				{ provide: NodeManager, useValue: mockNodeManager },
				{ provide: PlayerManager, useValue: mockPlayerManager },
				{ provide: LavalinkManager, useValue: mockLavalinkManager },
				{ provide: Client, useValue: mockClient },
				{ provide: PlayerSaver, useValue: mockPlayerSaver },
				{ provide: PlayerStore, useValue: mockStore },
				{ provide: LAVALINK_MODULE_OPTIONS, useValue: mockOptions }
			]
		}).compile();

		resumingHandler = moduleRef.get<ResumingHandler>(ResumingHandler);
	});

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(resumingHandler).toBeDefined();
	});

	describe('resume', () => {
		it('should setup event listeners', async () => {
			await resumingHandler['resume']();

			expect(mockLavalinkManager.on).toHaveBeenCalledWith(
				'playerCreate',
				expect.any(Function)
			);
			expect(mockLavalinkManager.on).toHaveBeenCalledWith(
				'playerUpdate',
				expect.any(Function)
			);
			expect(mockLavalinkManager.on).toHaveBeenCalledWith(
				'playerDestroy',
				expect.any(Function)
			);
			expect(mockNodeManager.on).toHaveBeenCalledWith('connect', expect.any(Function));
			expect(mockNodeManager.on).toHaveBeenCalledWith('resumed', expect.any(Function));
		});

		it('should handle playerCreate event', async () => {
			await resumingHandler['resume']();

			const playerCreateHandler = mockLavalinkManager.on.mock.calls.find(
				call => call[0] === 'playerCreate'
			)[1];

			const mockPlayer = { guildId: 'guild1' } as Player;
			await playerCreateHandler(mockPlayer);

			expect(mockPlayerSaver.savePlayerOnCreate).toHaveBeenCalledWith(mockPlayer);
		});

		it('should handle playerUpdate event', async () => {
			await resumingHandler['resume']();

			const playerUpdateHandler = mockLavalinkManager.on.mock.calls.find(
				call => call[0] === 'playerUpdate'
			)[1];

			const oldPlayer = { guildId: 'guild1' };
			const newPlayer = { guildId: 'guild1' } as Player;
			await playerUpdateHandler(oldPlayer, newPlayer);

			expect(mockPlayerSaver.savePlayerOnUpdate).toHaveBeenCalledWith(oldPlayer, newPlayer);
		});

		it('should handle playerDestroy event', async () => {
			await resumingHandler['resume']();

			const playerDestroyHandler = mockLavalinkManager.on.mock.calls.find(
				call => call[0] === 'playerDestroy'
			)[1];

			const mockPlayer = { guildId: 'guild1' } as Player;
			const reason = 'disconnect';
			await playerDestroyHandler(mockPlayer, reason);

			expect(mockPlayerSaver.deletePlayer).toHaveBeenCalledWith('guild1');
		});

		it('should handle node connect event', async () => {
			await resumingHandler['resume']();

			const nodeConnectHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'connect'
			)[1];

			const mockNode = {
				updateSession: jest.fn()
			};

			await nodeConnectHandler(mockNode);

			expect(mockNode.updateSession).toHaveBeenCalledWith(true, 300000);
		});

		it('should handle node connect event with default timer', async () => {
			const optionsWithoutTimer = {
				autoResume: {}
			};

			moduleRef = await Test.createTestingModule({
				providers: [
					ResumingHandler,
					{ provide: NodeManager, useValue: mockNodeManager },
					{ provide: PlayerManager, useValue: mockPlayerManager },
					{ provide: LavalinkManager, useValue: mockLavalinkManager },
					{ provide: Client, useValue: mockClient },
					{ provide: PlayerSaver, useValue: mockPlayerSaver },
					{ provide: PlayerStore, useValue: mockStore },
					{ provide: LAVALINK_MODULE_OPTIONS, useValue: optionsWithoutTimer }
				]
			}).compile();

			resumingHandler = moduleRef.get<ResumingHandler>(ResumingHandler);
			await resumingHandler['resume']();

			const nodeConnectHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'connect'
			)[1];

			const mockNode = {
				updateSession: jest.fn()
			};

			await nodeConnectHandler(mockNode);

			expect(mockNode.updateSession).toHaveBeenCalledWith(true, 360000);
		});

		it('should handle node resumed event with no players', async () => {
			await resumingHandler['resume']();

			const nodeResumedHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'resumed'
			)[1];

			const mockNode = { id: 'node1' };
			const payload = {};
			const players = null;

			await nodeResumedHandler(mockNode, payload, players);

			expect(mockPlayerManager.create).not.toHaveBeenCalled();
		});

		it('should handle node resumed event with empty players array', async () => {
			await resumingHandler['resume']();

			const nodeResumedHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'resumed'
			)[1];

			const mockNode = { id: 'node1' };
			const payload = {};
			const players = [];

			await nodeResumedHandler(mockNode, payload, players);

			expect(mockPlayerManager.create).not.toHaveBeenCalled();
		});

		it('should handle node resumed event with connected players', async () => {
			const mockPlayer = {
				connect: jest.fn(),
				filterManager: { data: {} },
				queue: {
					utils: {
						sync: jest.fn().mockResolvedValue(undefined)
					},
					current: null
				},
				ping: { lavalink: 0 },
				lastPosition: 0,
				lastPositionChange: Date.now(),
				paused: false,
				playing: false
			};

			mockPlayerManager.create.mockReturnValue(mockPlayer);
			mockStore.get.mockResolvedValue({
				voiceChannelId: 'voice1',
				textChannelId: 'text1',
				options: {
					selfDeaf: true,
					selfMute: false,
					applyVolumeAsFilter: false,
					instaUpdateFiltersFix: true,
					vcRegion: 'us-east'
				}
			});

			await resumingHandler['resume']();

			const nodeResumedHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'resumed'
			)[1];

			const mockNode = { id: 'node1' };
			const payload = {};
			const players = [
				{
					guildId: 'guild1',
					state: {
						connected: true,
						position: 5000,
						ping: 50
					},
					volume: 80,
					filters: { volume: 0.8 },
					track: {
						encoded: 'track123',
						info: { title: 'Test Song' }
					},
					paused: false
				}
			];

			mockLavalinkManager.utils.buildTrack.mockReturnValue({
				encoded: 'track123',
				info: { title: 'Test Song' },
				requester: mockClient.user
			});

			await nodeResumedHandler(mockNode, payload, players);

			expect(mockPlayerSaver.transformId).toHaveBeenCalledWith('guild1');
			expect(mockStore.get).toHaveBeenCalledWith('player:guild1');
			expect(mockPlayerManager.create).toHaveBeenCalledWith({
				guildId: 'guild1',
				voiceChannelId: 'voice1',
				textChannelId: 'text1',
				selfDeaf: true,
				selfMute: false,
				volume: 80,
				node: 'node1',
				applyVolumeAsFilter: false,
				instaUpdateFiltersFix: true,
				vcRegion: 'us-east'
			});
			expect(mockPlayer.connect).toHaveBeenCalled();
			expect(mockPlayer.filterManager.data).toEqual({ volume: 0.8 });
			expect(mockPlayer.queue.utils.sync).toHaveBeenCalledWith(true, false);
			expect(mockLavalinkManager.utils.buildTrack).toHaveBeenCalledWith(
				players[0].track,
				mockClient.user
			);
		});

		it('should handle node resumed event with disconnected players', async () => {
			const mockPlayer = {
				connect: jest.fn(),
				filterManager: { data: {} },
				queue: {
					utils: {
						sync: jest.fn().mockResolvedValue(undefined)
					},
					current: null
				},
				ping: { lavalink: 0 },
				lastPosition: 0,
				lastPositionChange: Date.now(),
				paused: false,
				playing: false
			};

			mockPlayerManager.create.mockReturnValue(mockPlayer);
			mockStore.get.mockResolvedValue({
				voiceChannelId: 'voice1',
				textChannelId: 'text1',
				options: {
					selfDeaf: true,
					selfMute: false,
					applyVolumeAsFilter: false,
					instaUpdateFiltersFix: true,
					vcRegion: 'us-east'
				}
			});

			await resumingHandler['resume']();

			const nodeResumedHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'resumed'
			)[1];

			const mockNode = { id: 'node1' };
			const payload = {};
			const players = [
				{
					guildId: 'guild1',
					state: {
						connected: false,
						position: 5000,
						ping: 50
					},
					volume: 80,
					filters: {},
					paused: false
				}
			];

			await nodeResumedHandler(mockNode, payload, players);

			expect(mockPlayerSaver.transformId).toHaveBeenCalledWith('guild1');
			expect(mockStore.delete).toHaveBeenCalledWith('player:guild1');
			expect(mockPlayerManager.create).toHaveBeenCalled();
		});

		it('should handle node resumed event with volume decrementer', async () => {
			const mockPlayer = {
				connect: jest.fn(),
				filterManager: { data: {} },
				queue: {
					utils: {
						sync: jest.fn().mockResolvedValue(undefined)
					},
					current: null
				},
				ping: { lavalink: 0 },
				lastPosition: 0,
				lastPositionChange: Date.now(),
				paused: false,
				playing: false
			};

			mockPlayerManager.create.mockReturnValue(mockPlayer);
			mockStore.get.mockResolvedValue({
				voiceChannelId: 'voice1',
				textChannelId: 'text1',
				options: {
					selfDeaf: true,
					selfMute: false,
					applyVolumeAsFilter: false,
					instaUpdateFiltersFix: true,
					vcRegion: 'us-east'
				}
			});

			const optionsWithDecrementer = {
				autoResume: { timer: 300000 },
				playerOptions: {
					volumeDecrementer: 2
				}
			};

			moduleRef = await Test.createTestingModule({
				providers: [
					ResumingHandler,
					{ provide: NodeManager, useValue: mockNodeManager },
					{ provide: PlayerManager, useValue: mockPlayerManager },
					{ provide: LavalinkManager, useValue: mockLavalinkManager },
					{ provide: Client, useValue: mockClient },
					{ provide: PlayerSaver, useValue: mockPlayerSaver },
					{ provide: PlayerStore, useValue: mockStore },
					{ provide: LAVALINK_MODULE_OPTIONS, useValue: optionsWithDecrementer }
				]
			}).compile();

			resumingHandler = moduleRef.get<ResumingHandler>(ResumingHandler);
			await resumingHandler['resume']();

			const nodeResumedHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'resumed'
			)[1];

			const mockNode = { id: 'node1' };
			const payload = {};
			const players = [
				{
					guildId: 'guild1',
					state: {
						connected: true,
						position: 5000,
						ping: 50
					},
					volume: 80,
					filters: {},
					paused: false
				}
			];

			await nodeResumedHandler(mockNode, payload, players);

			expect(mockPlayerManager.create).toHaveBeenCalledWith({
				guildId: 'guild1',
				voiceChannelId: 'voice1',
				textChannelId: 'text1',
				selfDeaf: true,
				selfMute: false,
				volume: 40,
				node: 'node1',
				applyVolumeAsFilter: false,
				instaUpdateFiltersFix: true,
				vcRegion: 'us-east'
			});
		});

		it('should handle node resumed event with existing queue current track', async () => {
			const mockPlayer = {
				connect: jest.fn(),
				filterManager: { data: {} },
				queue: {
					utils: {
						sync: jest.fn().mockResolvedValue(undefined)
					},
					current: {
						requester: { id: 'user123' }
					}
				},
				ping: { lavalink: 0 },
				lastPosition: 0,
				lastPositionChange: Date.now(),
				paused: false,
				playing: false
			};

			mockPlayerManager.create.mockReturnValue(mockPlayer);
			mockStore.get.mockResolvedValue({
				voiceChannelId: 'voice1',
				textChannelId: 'text1',
				options: {
					selfDeaf: true,
					selfMute: false,
					applyVolumeAsFilter: false,
					instaUpdateFiltersFix: true,
					vcRegion: 'us-east'
				}
			});

			await resumingHandler['resume']();

			const nodeResumedHandler = mockNodeManager.on.mock.calls.find(
				call => call[0] === 'resumed'
			)[1];

			const mockNode = { id: 'node1' };
			const payload = {};
			const players = [
				{
					guildId: 'guild1',
					state: {
						connected: true,
						position: 5000,
						ping: 50
					},
					volume: 80,
					filters: {},
					track: {
						encoded: 'track123',
						info: { title: 'Test Song' }
					},
					paused: false
				}
			];

			mockLavalinkManager.utils.buildTrack.mockReturnValue({
				encoded: 'track123',
				info: { title: 'Test Song' },
				requester: { id: 'user123' }
			});

			await nodeResumedHandler(mockNode, payload, players);

			expect(mockLavalinkManager.utils.buildTrack).toHaveBeenCalledWith(players[0].track, {
				id: 'user123'
			});
		});
	});
});
