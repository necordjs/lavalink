import { DestroyReasonsType, LavalinkManager, Player, PlayerOptions } from 'lavalink-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerManagerService {
	public constructor(private readonly lavalinkManager: LavalinkManager) {}

	public get(guildId: string) {
		return this.lavalinkManager.getPlayer(guildId);
	}

	public create(options: PlayerOptions): Player {
		return this.lavalinkManager.createPlayer(options);
	}

	public async destroy(guildId: string, reason?: DestroyReasonsType): Promise<void | Player> {
		return this.lavalinkManager.destroyPlayer(guildId, reason);
	}

	public delete(guildId: string) {
		this.lavalinkManager.deletePlayer(guildId);
	}
}
