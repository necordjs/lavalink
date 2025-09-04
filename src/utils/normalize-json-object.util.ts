export function normalizeJsonObject(obj: unknown) {
	return JSON.stringify(obj, Object.keys(obj).sort());
}
