import 'reflect-metadata';
import {
	LavalinkHostType,
	LavalinkListener,
	LavalinkListenerType,
	LavalinkListenerMeta
} from '../../../src';

describe('@LavalinkListener', () => {
	class TestListener {
		@LavalinkListener({
			event: 'playerCreate',
			type: LavalinkListenerType.On,
			host: LavalinkHostType.LavalinkManager
		})
		handleplayerCreateEvent() {
			// handle the event
		}
	}

	it('should be defined', () => {
		expect(LavalinkListener).toBeDefined();
		expect(LavalinkListener.KEY).toBeDefined();
	});

	it('should attach metadata to the method', () => {
		const metadata: LavalinkListenerMeta = Reflect.getMetadata(
			LavalinkListener.KEY,
			TestListener.prototype['handleplayerCreateEvent']
		);

		expect(metadata).toBeDefined();
		expect(metadata.event).toBe('playerCreate');
		expect(metadata.type).toBe(LavalinkListenerType.On);
		expect(metadata.host).toBe(LavalinkHostType.LavalinkManager);
	});
});
