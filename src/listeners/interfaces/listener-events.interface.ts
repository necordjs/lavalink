import { LavalinkManagerEvents, NodeManagerEvents } from 'lavalink-client';

type FormatEventInterface<T> = {
	[K in keyof T]: T[K] extends (...args: infer P) => void ? P : never;
};

export type NecordLavalinkManagerEvents = FormatEventInterface<LavalinkManagerEvents>;

export type NecordNodeManagerEvents = FormatEventInterface<NodeManagerEvents>;

export type NecordLavalinkEvents = NecordLavalinkManagerEvents & NecordNodeManagerEvents;
