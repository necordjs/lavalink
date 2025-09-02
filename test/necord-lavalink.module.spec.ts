import { DestroyReasons } from 'lavalink-client';
import { NecordLavalinkModuleOptions, NecordLavalinkModule } from '../src';

describe('NecordLavalinkModule', () => {
	let module: NecordLavalinkModule;
	let mockClient: any;
	let mockLavalinkManager: any;
	let mockNodeManager: any;
	let mockOptions: NecordLavalinkModuleOptions;

	beforeEach(() => {
		mockClient = {
			user: { id: '123', username: 'TestBot' },
			once: jest.fn().mockReturnThis(),
			on: jest.fn().mockReturnThis()
		};

		mockLavalinkManager = {
			init: jest.fn(),
			sendRawData: jest.fn(),
			removeAllListeners: jest.fn(),
			players: [{ destroy: jest.fn() }, { destroy: jest.fn() }]
		};

		mockNodeManager = {
			removeAllListeners: jest.fn(),
			nodes: [{ destroy: jest.fn() }, { destroy: jest.fn() }]
		};

		mockOptions = {
			client: undefined,
			nodes: [
				{
					id: 'test-node',
					host: 'localhost',
					port: 2333,
					authorization: 'youshallnotpass',
					secure: false
				}
			]
		};

		module = new NecordLavalinkModule(
			mockClient,
			mockLavalinkManager,
			mockNodeManager,
			mockOptions
		);
	});

	it('should initialize LavalinkManager on client ready', async () => {
		module.onModuleInit();

		const readyCallback = mockClient.once.mock.calls.find(call => call[0] === 'ready')[1];
		await readyCallback();

		expect(mockLavalinkManager.init).toHaveBeenCalledWith({
			id: '123',
			username: 'TestBot'
		});
		expect(mockClient.once).toHaveBeenCalledWith('ready', expect.any(Function));
		expect(mockClient.on).toHaveBeenCalledWith('raw', expect.any(Function));
	});

	it('should call sendRawData on raw event', () => {
		module.onModuleInit();

		const rawCallback = mockClient.on.mock.calls.find(call => call[0] === 'raw')[1];
		const data = { op: 'test' };
		rawCallback(data);

		expect(mockLavalinkManager.sendRawData).toHaveBeenCalledWith(data);
	});

	it('should remove listeners and destroy players/nodes on shutdown', () => {
		module.onApplicationShutdown();

		expect(mockLavalinkManager.removeAllListeners).toHaveBeenCalled();
		mockLavalinkManager.players.forEach(player =>
			expect(player.destroy).toHaveBeenCalledWith(DestroyReasons.Disconnected)
		);

		expect(mockNodeManager.removeAllListeners).toHaveBeenCalled();
		mockNodeManager.nodes.forEach(node =>
			expect(node.destroy).toHaveBeenCalledWith(DestroyReasons.NodeDestroy)
		);
	});

	it('getClientOptions should return default client info if options.client is undefined', () => {
		expect(module['getClientOptions']()).toEqual({
			id: '123',
			username: 'TestBot'
		});
	});

	it('getClientOptions should return provided client options if exists', () => {
		const customModule = new NecordLavalinkModule(
			mockClient,
			mockLavalinkManager,
			mockNodeManager,
			{
				client: { id: '999', username: 'CustomBot' },
				nodes: mockOptions.nodes
			}
		);

		expect(customModule['getClientOptions']()).toEqual({
			id: '999',
			username: 'CustomBot'
		});
	});
});
