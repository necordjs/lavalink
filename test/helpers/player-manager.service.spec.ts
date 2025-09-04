import { PlayerManager } from '../../src';

describe('PlayerManager', () => {
	let playerManager: PlayerManager;
	const lavalinkManagerMock = {
		getPlayer: jest.fn(),
		createPlayer: jest.fn(),
		destroyPlayer: jest.fn(),
		deletePlayer: jest.fn()
	};

	beforeEach(() => {
		playerManager = new PlayerManager(lavalinkManagerMock as any);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(playerManager).toBeDefined();
	});

	it('should get a player by guildId', () => {
		const guildId = '1234567890';
		playerManager.get(guildId);
		expect(lavalinkManagerMock.getPlayer).toHaveBeenCalledWith(guildId);
	});

	it('should create a player with given options', () => {
		const options = {
			guildId: '1234567890',
			voiceChannelId: '0987654321',
			textChannelId: '1122334455'
		};
		playerManager.create(options);
		expect(lavalinkManagerMock.createPlayer).toHaveBeenCalledWith(options);
	});

	it('should destroy a player by guildId with optional reason', async () => {
		const guildId = '1234567890';
		const reason = 'TestReason';
		await playerManager.destroy(guildId, reason);
		expect(lavalinkManagerMock.destroyPlayer).toHaveBeenCalledWith(guildId, reason);
	});

	it('should delete a player by guildId', () => {
		const guildId = '1234567890';
		playerManager.delete(guildId);
		expect(lavalinkManagerMock.deletePlayer).toHaveBeenCalledWith(guildId);
	});
});
