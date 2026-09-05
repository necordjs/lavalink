import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
	LAVALINK_MANAGER,
	LAVALINK_NODE_MANAGER,
	LavalinkHostType,
	LavalinkListenersModule,
	LavalinkListenerType
} from '../../src/index.js';

describe('LavalinkListenersModule', () => {
	let module: LavalinkListenersModule;
	let moduleRef: TestingModule;
	let lavalinkManager: any;
	let nodeManager: any;
	let discoveryService: any;
	let metadataScanner: any;
	let reflector: any;

	beforeEach(async () => {
		lavalinkManager = { on: vi.fn<(...args: any[]) => any>() };
		nodeManager = { on: vi.fn<(...args: any[]) => any>() };

		const fakeProviderInstance = {
			onPlayerCreate: vi.fn<(...args: any[]) => any>()
		};
		discoveryService = {
			getProviders: vi.fn<(...args: any[]) => any>().mockReturnValue([
				{
					instance: fakeProviderInstance,
					isDependencyTreeStatic: vi.fn<(...args: any[]) => any>().mockReturnValue(true)
				}
			])
		};

		metadataScanner = {
			getAllMethodNames: vi.fn<(...args: any[]) => any>().mockReturnValue(['onPlayerCreate'])
		};

		reflector = {
			get: vi.fn<(...args: any[]) => any>().mockReturnValue({
				event: 'playerCreate',
				type: LavalinkListenerType.On,
				host: LavalinkHostType.LavalinkManager
			})
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				LavalinkListenersModule, //TODO: FIXME!!!
				{
					provide: DiscoveryService,
					useValue: discoveryService
				},
				{
					provide: MetadataScanner,
					useValue: metadataScanner
				},
				{
					provide: Reflector,
					useValue: reflector
				},
				{
					provide: LAVALINK_MANAGER,
					useValue: lavalinkManager
				},
				{
					provide: LAVALINK_NODE_MANAGER,
					useValue: nodeManager
				}
			]
		}).compile();

		module = moduleRef.get<LavalinkListenersModule>(LavalinkListenersModule);
	});

	afterEach(async () => {
		if (moduleRef) {
			await moduleRef.close();
		}
	});

	it('should register LavalinkManager listener on onModuleInit', () => {
		module.onModuleInit();

		expect(discoveryService.getProviders).toHaveBeenCalled();
		expect(metadataScanner.getAllMethodNames).toHaveBeenCalledWith(expect.any(Object));
		expect(lavalinkManager.on).toHaveBeenCalledWith('playerCreate', expect.any(Function));
	});

	it('should call the decorated method when event is emitted', () => {
		let registeredHandler!: (...args: any[]) => void;

		lavalinkManager.on.mockImplementationOnce((event, handler) => {
			registeredHandler = handler;
		});

		module.onModuleInit();

		const discoveryServiceFromModule = moduleRef.get<DiscoveryService>(DiscoveryService);
		const provider = discoveryServiceFromModule.getProviders()[0].instance;

		registeredHandler('arg1', 'arg2');

		expect(provider.onPlayerCreate).toHaveBeenCalledWith(['arg1', 'arg2']);
	});
});
