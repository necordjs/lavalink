import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'discord.js';

import {
	NecordLavalinkModuleOptions,
	NecordLavalinkModule,
	LAVALINK_NODE_MANAGER,
	LAVALINK_MODULE_OPTIONS,
	ResumingHandlerService,
	LAVALINK_MANAGER
} from '../src/index.js';

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
			once: vi.fn<(...args: any[]) => any>(),
			on: vi.fn<(...args: any[]) => any>()
		};

		mockClient.once.mockReturnValue(mockClient);
		mockClient.on.mockReturnValue(mockClient);

		mockLavalinkManager = {
			init: vi.fn<(...args: any[]) => any>(),
			sendRawData: vi.fn<(...args: any[]) => any>(),
			removeAllListeners: vi.fn<(...args: any[]) => any>(),
			players: new Map([
				['player1', { destroy: vi.fn<(...args: any[]) => any>() }],
				['player2', { destroy: vi.fn<(...args: any[]) => any>() }]
			])
		};

		mockNodeManager = {
			removeAllListeners: vi.fn<(...args: any[]) => any>(),
			nodes: new Map([
				['node1', { destroy: vi.fn<(...args: any[]) => any>() }],
				['node2', { destroy: vi.fn<(...args: any[]) => any>() }]
			])
		};

		mockResumingHandler = {
			resume: vi.fn<(...args: any[]) => any>()
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
			],
			gracefulShutdown: {
				destroyPlayers: true,
				destroyNodes: true
			}
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				NecordLavalinkModule,
				{
					provide: Client,
					useValue: mockClient
				},
				{
					provide: LAVALINK_MANAGER,
					useValue: mockLavalinkManager
				},
				{
					provide: LAVALINK_NODE_MANAGER,
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
		let readyHandler!: () => void | Promise<void>;
		let _rawHandler!: (data: any) => void;

		mockClient.once.mockImplementationOnce((event, handler) => {
			if (event === 'clientReady') readyHandler = handler;
			return mockClient;
		});

		mockClient.on.mockImplementationOnce((event, handler) => {
			if (event === 'raw') _rawHandler = handler;
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
		let rawHandler!: (data: any) => void;

		mockClient.once.mockImplementationOnce(() => {
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

		mockLavalinkManager.players.forEach(player =>
			expect(player.destroy).toHaveBeenCalledWith('ApplicationShutdown')
		);

		mockNodeManager.nodes.forEach(node =>
			expect(node.destroy).toHaveBeenCalledWith('ApplicationShutdown')
		);
	});

	it('should not destroy players when destroyPlayers is false', async () => {
		const optionsWithoutDestroyPlayers = {
			client: undefined,
			nodes: mockOptions.nodes,
			gracefulShutdown: {
				destroyPlayers: false,
				destroyNodes: true
			}
		};

		const customModuleRef = await Test.createTestingModule({
			providers: [
				NecordLavalinkModule,
				{
					provide: Client,
					useValue: mockClient
				},
				{
					provide: LAVALINK_MANAGER,
					useValue: mockLavalinkManager
				},
				{
					provide: LAVALINK_NODE_MANAGER,
					useValue: mockNodeManager
				},
				{
					provide: LAVALINK_MODULE_OPTIONS,
					useValue: optionsWithoutDestroyPlayers
				},
				{
					provide: ResumingHandlerService,
					useValue: mockResumingHandler
				}
			]
		}).compile();

		const customModule = customModuleRef.get<NecordLavalinkModule>(NecordLavalinkModule);

		mockLavalinkManager.players.forEach(player => player.destroy.mockClear());
		mockNodeManager.nodes.forEach(node => node.destroy.mockClear());

		customModule.onApplicationShutdown();

		mockLavalinkManager.players.forEach(player =>
			expect(player.destroy).not.toHaveBeenCalled()
		);

		mockNodeManager.nodes.forEach(node =>
			expect(node.destroy).toHaveBeenCalledWith('ApplicationShutdown')
		);

		await customModuleRef.close();
	});

	it('should not destroy nodes when destroyNodes is false', async () => {
		const optionsWithoutDestroyNodes = {
			client: undefined,
			nodes: mockOptions.nodes,
			gracefulShutdown: {
				destroyPlayers: true,
				destroyNodes: false
			}
		};

		const customModuleRef = await Test.createTestingModule({
			providers: [
				NecordLavalinkModule,
				{
					provide: Client,
					useValue: mockClient
				},
				{
					provide: LAVALINK_MANAGER,
					useValue: mockLavalinkManager
				},
				{
					provide: LAVALINK_NODE_MANAGER,
					useValue: mockNodeManager
				},
				{
					provide: LAVALINK_MODULE_OPTIONS,
					useValue: optionsWithoutDestroyNodes
				},
				{
					provide: ResumingHandlerService,
					useValue: mockResumingHandler
				}
			]
		}).compile();

		const customModule = customModuleRef.get<NecordLavalinkModule>(NecordLavalinkModule);

		mockLavalinkManager.players.forEach(player => player.destroy.mockClear());
		mockNodeManager.nodes.forEach(node => node.destroy.mockClear());

		customModule.onApplicationShutdown();

		mockLavalinkManager.players.forEach(player =>
			expect(player.destroy).toHaveBeenCalledWith('ApplicationShutdown')
		);

		mockNodeManager.nodes.forEach(node => expect(node.destroy).not.toHaveBeenCalled());

		await customModuleRef.close();
	});

	it('should not destroy players or nodes when both options are false', async () => {
		const optionsWithoutDestroy = {
			client: undefined,
			nodes: mockOptions.nodes,
			gracefulShutdown: {
				destroyPlayers: false,
				destroyNodes: false
			}
		};

		const customModuleRef = await Test.createTestingModule({
			providers: [
				NecordLavalinkModule,
				{
					provide: Client,
					useValue: mockClient
				},
				{
					provide: LAVALINK_MANAGER,
					useValue: mockLavalinkManager
				},
				{
					provide: LAVALINK_NODE_MANAGER,
					useValue: mockNodeManager
				},
				{
					provide: LAVALINK_MODULE_OPTIONS,
					useValue: optionsWithoutDestroy
				},
				{
					provide: ResumingHandlerService,
					useValue: mockResumingHandler
				}
			]
		}).compile();

		const customModule = customModuleRef.get<NecordLavalinkModule>(NecordLavalinkModule);

		mockLavalinkManager.players.forEach(player => player.destroy.mockClear());
		mockNodeManager.nodes.forEach(node => node.destroy.mockClear());

		customModule.onApplicationShutdown();

		mockLavalinkManager.players.forEach(player =>
			expect(player.destroy).not.toHaveBeenCalled()
		);

		mockNodeManager.nodes.forEach(node => expect(node.destroy).not.toHaveBeenCalled());

		await customModuleRef.close();
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
					provide: LAVALINK_MANAGER,
					useValue: mockLavalinkManager
				},
				{
					provide: LAVALINK_NODE_MANAGER,
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
