import { Test, TestingModule } from '@nestjs/testing';
import { PlayerSaver } from '../../src/services';
import { PlayerSaverProvider } from '../../src/providers/player-saver.provider';
import { PlayerStore } from '../../src/constants';
import { Player } from 'lavalink-client';

describe('PlayerSaverProvider', () => {
	let moduleRef: TestingModule;
	let playerSaver: PlayerSaver;
	let mockStore: any;

	beforeEach(() => {
		mockStore = {
			get: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
			getAll: jest.fn()
		};
	});

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
		jest.clearAllMocks();
	});

	it('should create PlayerSaver instance with provided store', async () => {
		moduleRef = await Test.createTestingModule({
			providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: mockStore }]
		}).compile();

		playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBeInstanceOf(PlayerSaver);
	});

	it('should create PlayerSaver instance with null store', async () => {
		moduleRef = await Test.createTestingModule({
			providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: null }]
		}).compile();

		playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBeInstanceOf(PlayerSaver);
	});

	it('should create PlayerSaver instance with undefined store', async () => {
		moduleRef = await Test.createTestingModule({
			providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: undefined }]
		}).compile();

		playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBeInstanceOf(PlayerSaver);
	});

	describe('PlayerSaver methods', () => {
		beforeEach(async () => {
			moduleRef = await Test.createTestingModule({
				providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: mockStore }]
			}).compile();

			playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		});

		it('should save player when old and new player data differ', async () => {
			const oldPlayer = {
				guildId: 'guild1',
				paused: false,
				volume: 100
			};

			const mockPlayer = {
				toJSON: jest.fn().mockReturnValue({
					guildId: 'guild1',
					paused: true,
					volume: 80
				})
			} as unknown as Player;

			await playerSaver.savePlayerOnUpdate(oldPlayer as any, mockPlayer);

			expect(mockStore.save).toHaveBeenCalledWith(
				'player:guild1',
				JSON.stringify(mockPlayer.toJSON())
			);
		});

		it('should not save player when old and new player data are the same', async () => {
			const playerData = {
				guildId: 'guild1',
				paused: false,
				volume: 100
			};

			const mockPlayer = {
				toJSON: jest.fn().mockReturnValue(playerData)
			} as unknown as Player;

			await playerSaver.savePlayerOnUpdate(playerData as any, mockPlayer);

			expect(mockStore.save).not.toHaveBeenCalled();
		});

		it('should save player when oldPlayer is null', async () => {
			const mockPlayer = {
				toJSON: jest.fn().mockReturnValue({
					guildId: 'guild1',
					nodeId: 'node1',
					nodeSessionId: 'session1',
					voiceChannelId: 'voice1',
					textChannelId: 'text1',
					selfDeaf: false,
					selfMute: false,
					paused: false,
					volume: 100,
					position: 0,
					repeatMode: 0,
					filters: {}
				})
			} as unknown as Player;

			await playerSaver.savePlayerOnUpdate(null, mockPlayer);

			expect(mockStore.save).toHaveBeenCalledWith(
				'player:guild1',
				JSON.stringify(mockPlayer.toJSON())
			);
		});

		it('should save player on create', async () => {
			const mockPlayer = {
				toJSON: jest.fn().mockReturnValue({
					guildId: 'guild1',
					paused: false,
					volume: 100
				})
			} as unknown as Player;

			await playerSaver.savePlayerOnCreate(mockPlayer);

			expect(mockStore.save).toHaveBeenCalledWith(
				'player:guild1',
				JSON.stringify(mockPlayer.toJSON())
			);
		});

		it('should delete player', async () => {
			await playerSaver.deletePlayer('guild1');

			expect(mockStore.delete).toHaveBeenCalledWith('player:guild1');
		});

		it('should return empty map when no players exist', async () => {
			mockStore.getAll.mockResolvedValue([]);

			const sessions = await playerSaver.getSessions();

			expect(sessions).toEqual(new Map());
		});

		it('should get sessions from saved players', async () => {
			const playerData = {
				guildId: 'guild1',
				nodeId: 'node1',
				nodeSessionId: 'session1'
			};

			mockStore.getAll.mockResolvedValue([{ value: JSON.stringify(playerData) }]);

			const sessions = await playerSaver.getSessions();

			expect(sessions.get('node1')).toBe('session1');
		});

		it('should handle buffer values in getSessions', async () => {
			const playerData = {
				guildId: 'guild1',
				nodeId: 'node1',
				nodeSessionId: 'session1'
			};

			mockStore.getAll.mockResolvedValue([
				{ value: Buffer.from(JSON.stringify(playerData), 'utf-8') }
			]);

			const sessions = await playerSaver.getSessions();

			expect(sessions.get('node1')).toBe('session1');
		});

		it('should skip players with null value', async () => {
			mockStore.getAll.mockResolvedValue([{ value: null }, { value: undefined }]);

			const sessions = await playerSaver.getSessions();

			expect(sessions).toEqual(new Map());
		});

		it('should skip players without nodeSessionId or nodeId', async () => {
			const playerData1 = {
				guildId: 'guild1',
				nodeId: 'node1',
				voiceChannelId: 'voice1'
			};

			const playerData2 = {
				guildId: 'guild2',
				nodeSessionId: 'session2',
				voiceChannelId: 'voice2'
			};

			mockStore.getAll.mockResolvedValue([
				{ value: JSON.stringify(playerData1) },
				{ value: JSON.stringify(playerData2) }
			]);

			const sessions = await playerSaver.getSessions();

			expect(sessions).toEqual(new Map());
		});

		it('should handle JSON parse errors in getSessions', async () => {
			mockStore.getAll.mockResolvedValue([{ value: 'invalid json' }]);

			const sessions = await playerSaver.getSessions();

			expect(sessions).toEqual(new Map());
		});

		it('should transform guild id correctly', () => {
			const transformedId = playerSaver.transformId('guild123');
			expect(transformedId).toBe('player:guild123');
		});
	});
});
