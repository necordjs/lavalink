import { LavalinkManagerEvents, NodeManagerEvents } from 'lavalink-client';

type FormatEventInterface<T> = {
	[K in keyof T]: T[K] extends (...args: infer P) => void ? P : never;
};

export type NecordLavalinkEvents = FormatEventInterface<LavalinkManagerEvents> &
	FormatEventInterface<NodeManagerEvents>;
