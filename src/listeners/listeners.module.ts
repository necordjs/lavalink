import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { LavalinkManager, NodeManager } from 'lavalink-client';
import { Module, OnModuleInit } from '@nestjs/common';

import { LavalinkListenerMeta } from './interfaces';
import { LavalinkListener } from './decorators';
import { LavalinkHostType } from './enums';

interface ExecutableListener extends LavalinkListenerMeta {
	run: (...args: any[]) => void;
}

@Module({
	imports: [DiscoveryModule]
})
export class LavalinkListenersModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly reflector: Reflector,
		private readonly lavalinkManager: LavalinkManager,
		private readonly nodeManager: NodeManager
	) {}

	public onModuleInit(): void {
		const groupedListeners = new Map<string, ExecutableListener[]>();
		const wrappers = this.discoveryService.getProviders().filter(wrapper => {
			const { instance } = wrapper;
			const prototype = instance ? Object.getPrototypeOf(instance) : null;

			return instance && prototype && wrapper.isDependencyTreeStatic();
		});

		for (const wrapper of wrappers) {
			const instance = wrapper.instance;
			const prototype = Object.getPrototypeOf(instance);

			const methods = this.metadataScanner.getAllMethodNames(prototype);

			for (const method of methods) {
				const meta = this.reflector.get<LavalinkListenerMeta>(
					LavalinkListener,
					instance[method]
				);

				if (!meta) continue;

				const event = meta.event;
				const host = meta.host;
				const run = instance[method].bind(instance);

				const key = `${event}:${host}`;

				const listeners = groupedListeners.get(key) ?? [];
				listeners.push({ ...meta, run });
				groupedListeners.set(key, listeners);
			}
		}

		for (const [key, listeners] of groupedListeners) {
			const [event, host] = key.split(':') as [string, LavalinkHostType];

			if (host === LavalinkHostType.LavalinkManager) {
				this.lavalinkManager.on(event as any, (...args: any[]) => {
					for (const listener of listeners) {
						listener.run(args);
					}
				});
			}

			if (host === LavalinkHostType.NodeManager) {
				this.nodeManager.on(event as any, (...args: any[]) => {
					for (const listener of listeners) {
						listener.run(args);
					}
				});
			}
		}
	}
}
