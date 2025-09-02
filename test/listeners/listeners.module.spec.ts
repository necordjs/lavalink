import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { LavalinkManager, NodeManager } from 'lavalink-client';
import {
	LavalinkHostType,
	LavalinkListenerMeta,
	LavalinkListenersModule,
	LavalinkListenerType
} from '../../src';

describe('LavalinkListenersModule', () => {
	let module: LavalinkListenersModule;
	let moduleRef: TestingModule;
	let lavalinkManager: any;
	let nodeManager: any;
	let discoveryService: any;
	let metadataScanner: any;
	let reflector: any;

	beforeEach(async () => {
		lavalinkManager = { on: jest.fn() };
		nodeManager = { on: jest.fn() };

		const fakeProviderInstance = {
			onPlayerCreate: jest.fn()
		};
		discoveryService = {
			getProviders: jest.fn().mockReturnValue([
				{
					instance: fakeProviderInstance,
					isDependencyTreeStatic: jest.fn().mockReturnValue(true)
				}
			])
		};

		metadataScanner = {
			getAllMethodNames: jest.fn().mockReturnValue(['onPlayerCreate'])
		};

		reflector = {
			get: jest.fn().mockReturnValue({
				event: 'playerCreate',
				type: LavalinkListenerType.On,
				host: LavalinkHostType.LavalinkManager
			} as LavalinkListenerMeta)
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
					provide: LavalinkManager,
					useValue: lavalinkManager
				},
				{
					provide: NodeManager,
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
		let registeredHandler: (...args: any[]) => void;

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
