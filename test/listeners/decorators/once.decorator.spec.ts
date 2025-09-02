import 'reflect-metadata';
import {
	LavalinkHostType,
	LavalinkListener,
	LavalinkListenerType,
	LavalinkListenerMeta,
	OnceLavalinkManager,
	OnceNodeManager
} from '../../../src';

describe('@OnceLavalinkManager', () => {
	class Test {
		@OnceLavalinkManager('playerCreate')
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
		expect(metadata.type).toBe(LavalinkListenerType.Once);
		expect(metadata.event).toBe('playerCreate');
		expect(metadata.host).toBe(LavalinkHostType.LavalinkManager);
	});
});

describe('@OnceNodeManager', () => {
	class Test {
		@OnceNodeManager('connect')
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
		expect(metadata.type).toBe(LavalinkListenerType.Once);
		expect(metadata.event).toBe('connect');
		expect(metadata.host).toBe(LavalinkHostType.NodeManager);
	});
});
