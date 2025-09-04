export function normalize(obj: unknown) {
	return JSON.stringify(obj, Object.keys(obj).sort());
}
