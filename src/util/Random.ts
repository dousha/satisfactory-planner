export function pickRandom<T>(xs: {[x: number]: T, length: number}): T {
	const len = xs.length;
	return xs[Math.floor(Math.random() * len)];
}

export function randomIdString(len: number = 6): string {
	const alphabet = '0123456789abcdef';
	let out = '';
	for (let i = 0; i < len; i++) {
		out += pickRandom(alphabet);
	}
	return out;
}
