import { PlayerJson } from 'lavalink-client';

export abstract class BaseStore {
	public abstract save(key: string, value: string): Promise<void>;

	public abstract delete(key: string): Promise<void>;

	public abstract get(key: string): Promise<PlayerJson | null>;

	public abstract getAll(): Promise<{ key: string; value: string }[]>;
}
