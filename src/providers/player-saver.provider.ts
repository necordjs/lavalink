import { PlayerStore } from '../constants';
import { BaseStore } from '../structures/base-store';
import { PlayerSaver } from '../helpers/player-saver';

export const PlayerSaverProvider = {
	provide: PlayerSaver,
	useFactory: (store: BaseStore) => new PlayerSaver(store),
	inject: [PlayerStore]
};
