import { Test, TestingModule } from '@nestjs/testing';
import { DestroyReasons, LavalinkManager, NodeManager } from 'lavalink-client';
import { Client } from 'discord.js';
import {
	NecordLavalinkModuleOptions,
	NecordLavalinkModule,
	LAVALINK_MODULE_OPTIONS,
	ResumingHandlerService
} from '../src';

describe('NecordLavalinkModule', () => {
	let module: NecordLavalinkModule;
	let moduleRef: TestingModule;
	let mockClient: any;
	let mockLavalinkManager: any;
	let mockNodeManager: any;
	let mockOptions: NecordLavalinkModuleOptions;
	let mockResumingHandler: any;

	beforeEach(async () => {
		mockClient = {
			user: { id: '123', username: 'TestBot' },
			once: jest.fn(),
			on: jest.fn()
		};

		mockClient.once.mockReturnValue(mockClient);
		mockClient.on.mockReturnValue(mockClient);

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

		mockResumingHandler = {
			resume: jest.fn()
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

		moduleRef = await Test.createTestingModule({
			providers: [
				NecordLavalinkModule,
				{
					provide: Client,
					useValue: mockClient
				},
				{
					provide: LavalinkManager,
					useValue: mockLavalinkManager
				},
				{
					provide: NodeManager,
					useValue: mockNodeManager
				},
				{
					provide: LAVALINK_MODULE_OPTIONS,
					useValue: mockOptions
				},
				{
					provide: ResumingHandlerService,
					useValue: mockResumingHandler
				}
			]
		}).compile();

		module = moduleRef.get<NecordLavalinkModule>(NecordLavalinkModule);
	});

	afterEach(async () => {
		await moduleRef.close();
	});

	it('should initialize LavalinkManager on client ready', async () => {
		let readyHandler: () => void;
		let rawHandler: (data: any) => void;

		mockClient.once.mockImplementationOnce((event, handler) => {
			if (event === 'clientReady') readyHandler = handler;
			return mockClient;
		});

		mockClient.on.mockImplementationOnce((event, handler) => {
			if (event === 'raw') rawHandler = handler;
			return mockClient;
		});

		module.onModuleInit();

		await readyHandler();

		expect(mockLavalinkManager.init).toHaveBeenCalledWith({
			id: '123',
			username: 'TestBot'
		});
		expect(mockClient.once).toHaveBeenCalledWith('clientReady', expect.any(Function));
		expect(mockClient.on).toHaveBeenCalledWith('raw', expect.any(Function));
	});

	it('should call sendRawData on raw event', () => {
		let rawHandler: (data: any) => void;

		mockClient.once.mockImplementationOnce((event, handler) => {
			return mockClient;
		});

		mockClient.on.mockImplementationOnce((event, handler) => {
			if (event === 'raw') rawHandler = handler;
			return mockClient;
		});

		module.onModuleInit();

		const data = { op: 'test' };
		rawHandler(data);

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

	it('getClientOptions should return provided client options if exists', async () => {
		const customOptions = {
			client: { id: '999', username: 'CustomBot' },
			nodes: mockOptions.nodes
		};

		const customModuleRef = await Test.createTestingModule({
			providers: [
				NecordLavalinkModule,
				{
					provide: Client,
					useValue: mockClient
				},
				{
					provide: LavalinkManager,
					useValue: mockLavalinkManager
				},
				{
					provide: NodeManager,
					useValue: mockNodeManager
				},
				{
					provide: LAVALINK_MODULE_OPTIONS,
					useValue: customOptions
				},
				{
					provide: ResumingHandlerService,
					useValue: mockResumingHandler
				}
			]
		}).compile();

		const customModule = customModuleRef.get<NecordLavalinkModule>(NecordLavalinkModule);

		expect(customModule['getClientOptions']()).toEqual({
			id: '999',
			username: 'CustomBot'
		});

		await customModuleRef.close();
	});
});
