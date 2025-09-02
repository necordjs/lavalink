import { Test, TestingModule } from '@nestjs/testing';
import { PlayerSaver } from '../../src/helpers';
import { PlayerSaverProvider } from '../../src/providers/player-saver.provider';
import { PlayerStore } from '../../src/constants';

describe('PlayerSaverProvider', () => {
	let moduleRef: TestingModule;

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should create PlayerSaver instance with provided store', async () => {
		const mockStore = {
			get: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
			getAll: jest.fn().mockResolvedValue([])
		};

		moduleRef = await Test.createTestingModule({
			providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: mockStore }]
		}).compile();

		const playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBeInstanceOf(PlayerSaver);
	});

	it('should create PlayerSaver instance with null store', async () => {
		moduleRef = await Test.createTestingModule({
			providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: null }]
		}).compile();

		const playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBeInstanceOf(PlayerSaver);
	});

	it('should create PlayerSaver instance with undefined store', async () => {
		moduleRef = await Test.createTestingModule({
			providers: [PlayerSaverProvider, { provide: PlayerStore, useValue: undefined }]
		}).compile();

		const playerSaver = moduleRef.get<PlayerSaver>(PlayerSaver);
		expect(playerSaver).toBeInstanceOf(PlayerSaver);
	});
});
