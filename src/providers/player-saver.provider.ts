import { PlayerStore } from '../constants';
import { BaseStore, PlayerSaver } from '../helpers';

export const PlayerSaverProvider = {
	provide: PlayerSaver,
	useFactory: (store: BaseStore) => new PlayerSaver(store),
	inject: [PlayerStore]
};
