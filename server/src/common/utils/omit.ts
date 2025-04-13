export function omit<T, K extends keyof T>(src: T, ...fields: K[]): Omit<T, K> {
	for (const field of fields) {
		delete src[<any>field];
	}

	return src;
}
