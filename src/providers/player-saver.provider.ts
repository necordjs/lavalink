import { Provider } from '@nestjs/common';
import { BaseStore } from '../helpers';
import { PlayerStore } from '../constants';
import { PlayerSaver } from '../services';

export const PlayerSaverProvider: Provider<PlayerSaver> = {
	provide: PlayerSaver,
	useFactory: (store: BaseStore) => new PlayerSaver(store),
	inject: [PlayerStore]
};
