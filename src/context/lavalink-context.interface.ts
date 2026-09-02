import { NecordLavalinkManagerEvents, NecordNodeManagerEvents } from '../listeners/index.js';

export type LavalinkManagerContextOf<K extends keyof E, E = NecordLavalinkManagerEvents> = E[K];
export type NodeManagerContextOf<K extends keyof E, E = NecordNodeManagerEvents> = E[K];
