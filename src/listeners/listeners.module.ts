import { LavalinkManagerEvents } from 'lavalink-client/dist/types/structures/Types/Manager';
import { Module, OnModuleInit } from '@nestjs/common';
import { LavalinkManager, NodeManagerEvents } from 'lavalink-client';
import { ExplorerService, Listener } from 'necord';
import { ListenerDiscovery } from './listener.discovery';

@Module({})
export class LavalinkListenersModule implements OnModuleInit {
	public constructor(
		private readonly lavalinkManager: LavalinkManager,
		private readonly explorerService: ExplorerService<ListenerDiscovery>
	) {}

	public onModuleInit(): void {
		return this.explorerService.explore(Listener.KEY).forEach(listener => {
			const event = listener.getEvent();

			if (event in this.lavalinkManager) {
				this.lavalinkManager[listener.getType()](
					event as keyof LavalinkManagerEvents,
					(...args) => listener.execute(args)
				);
			}

			if (event in this.lavalinkManager.nodeManager) {
				this.lavalinkManager.nodeManager[listener.getType()](
					event as keyof NodeManagerEvents,
					(...args) => listener.execute(args)
				);
			}
		});
	}
}
