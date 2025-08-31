export abstract class BaseStore {
	public abstract save(key: string, value: any): Promise<void>;

	public abstract delete(key: string): Promise<void>;

	public abstract get(key: string): Promise<any>;

	public abstract getAll(): Promise<{ key: string; value: string }[]>;
}
