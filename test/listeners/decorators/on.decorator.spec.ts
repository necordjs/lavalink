import 'reflect-metadata';
import {
	LavalinkHostType,
	LavalinkListener,
	LavalinkListenerType,
	OnLavalinkManager,
	LavalinkListenerMeta,
	OnNodeManager
} from '../../../src';

describe('@OnLavalinkManager', () => {
	class Test {
		@OnLavalinkManager('playerCreate')
		public execute() {
			return 'Executed';
		}
	}

	it('should attach correct metadata for LavalinkManager listener', () => {
		const metadata: LavalinkListenerMeta = Reflect.getMetadata(
			LavalinkListener.KEY,
			Test.prototype.execute
		);

		expect(metadata).toBeDefined();
		expect(metadata.type).toBe(LavalinkListenerType.On);
		expect(metadata.event).toBe('playerCreate');
		expect(metadata.host).toBe(LavalinkHostType.LavalinkManager);
	});
});

describe('@OnNodeManager', () => {
	class Test {
		@OnNodeManager('connect')
		public execute() {
			return 'Executed';
		}
	}

	it('should attach correct metadata for NodeManager listener', () => {
		const metadata: LavalinkListenerMeta = Reflect.getMetadata(
			LavalinkListener.KEY,
			Test.prototype.execute
		);

		expect(metadata).toBeDefined();
		expect(metadata.type).toBe(LavalinkListenerType.On);
		expect(metadata.event).toBe('connect');
		expect(metadata.host).toBe(LavalinkHostType.NodeManager);
	});
});
