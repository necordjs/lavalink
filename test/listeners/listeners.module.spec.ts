import {
	LavalinkHostType,
	LavalinkListenerMeta,
	LavalinkListenersModule,
	LavalinkListenerType
} from '../../src';

describe('LavalinkListenersModule', () => {
	let module: LavalinkListenersModule;
	let lavalinkManager: any;
	let nodeManager: any;
	let discoveryService: any;
	let metadataScanner: any;
	let reflector: any;

	beforeEach(() => {
		// Mocks
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

		module = new LavalinkListenersModule(
			discoveryService,
			metadataScanner,
			reflector,
			lavalinkManager,
			nodeManager
		);
	});

	it('should register LavalinkManager listener on onModuleInit', () => {
		module.onModuleInit();

		expect(discoveryService.getProviders).toHaveBeenCalled();
		expect(metadataScanner.getAllMethodNames).toHaveBeenCalledWith(expect.any(Object));
		expect(lavalinkManager.on).toHaveBeenCalledWith('playerCreate', expect.any(Function));
	});

	it('should call the decorated method when event is emitted', () => {
		module.onModuleInit();

		const callback = lavalinkManager.on.mock.calls[0][1];
		const provider = discoveryService.getProviders()[0].instance;

		callback('arg1', 'arg2');

		expect(provider.onPlayerCreate).toHaveBeenCalledWith(['arg1', 'arg2']);
	});
});
