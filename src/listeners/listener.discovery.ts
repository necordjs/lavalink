import { NecordBaseDiscovery } from 'necord';
import { NecordLavalinkEvents } from './listener.interface';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: NecordLavalinkEvents;
}

/**
 * Represents a listener discovery.
 */
export class ListenerDiscovery extends NecordBaseDiscovery<ListenerMeta> {
	public getType() {
		return this.meta.type;
	}

	public getEvent() {
		return this.meta.event;
	}

	public isListener(): this is ListenerDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
