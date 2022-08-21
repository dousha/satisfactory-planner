import { ResourceType } from './ResourceType';

export type ResourceFlow = Partial<Record<ResourceType, number>>;

export function addResourceFlow(left: ResourceFlow, right: ResourceFlow) {
	const leftKeys = Object.keys(left);

	Object.keys(right).forEach(key => {
		const value = right[key as ResourceType]!;
		if (leftKeys.indexOf(key) >= 0) {
			left[key as ResourceType]! += value;
		} else {
			left[key as ResourceType] = value;
		}
	});
}

export function subtractResourceFlow(left: ResourceFlow, right: ResourceFlow) {
	const leftKeys = Object.keys(left);

	Object.keys(right).forEach(key => {
		const value = right[key as ResourceType]!;
		if (leftKeys.indexOf(key) >= 0) {
			left[key as ResourceType]! -= value;
		} else {
			left[key as ResourceType] = -value;
		}
	});
}

export function divideResourceFlow(left: ResourceFlow, right: ResourceFlow): number {
	let result = 1;
	const leftKeys = Object.keys(left);

	Object.keys(right).forEach(key => {
		const value = right[key as ResourceType]!;
		if (leftKeys.indexOf(key) >= 0) {
			const quotient = left[key as ResourceType]! / value;
			if (quotient < result) {
				result = quotient;
			}
		} else {
			result = -Infinity;
		}
	});

	return result;
}

export function scaleResourceFlow(flow: ResourceFlow, scale: number) {
	if (isNaN(scale)) { return; }

	if (scale < 0) { scale = 0; }

	if (!isFinite(scale)) { scale = 1; }

	const keys = Object.keys(flow);
	keys.forEach(key => flow[key as ResourceType]! *= scale);
}
