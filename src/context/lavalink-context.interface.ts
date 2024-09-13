import { NecordLavalinkEvents } from '../listeners/listener.interface';

export type LavalinkContextOf<K extends keyof E, E = NecordLavalinkEvents> = E[K];
