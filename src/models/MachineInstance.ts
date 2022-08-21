import { Machine } from './Machine';
import { ResourceUtility } from './ResourceUtility';
import { ResourceFlow, scaleResourceFlow } from './ResourceFlow';
import { randomIdString } from '../util/Random';

export interface MachineInstance {
	id: string;
	name: string;
	template: Machine;
	clockSpeed: number;
	priority: number;
}

export class CalculatedMachineInstance {
	public constructor(machine: MachineInstance, utilityRate: number) {
		this.instance = machine;
		this.utilityRate = utilityRate > 1 ? 1 : (utilityRate < 0 ? 0 : utilityRate);
	}

	public getInputResourceFlow(): ResourceFlow {
		const result: ResourceFlow = getInputResourceFlow(this.instance);
		scaleResourceFlow(result, this.utilityRate);
		return result;
	}

	public getOutputResourceFlow(): ResourceFlow {
		const result = getOutputResourceFlow(this.instance);
		scaleResourceFlow(result, this.utilityRate);
		return result;
	}

	public isRunningShort(): boolean {
		return this.utilityRate < 1;
	}

	public isStalled(): boolean {
		return this.utilityRate === 0;
	}

	public readonly instance: MachineInstance;
	public readonly utilityRate: number;
}

export function createMachineInstance(template: Machine): MachineInstance {
	return {
		id: randomIdString(16),
		name: template.name,
		template: template,
		clockSpeed: 1.0,
		priority: 1,
	};
}

function getResourceFlow(base: ResourceUtility[], clock: number): ResourceFlow {
	const result: ResourceFlow = {};

	base.forEach(x => {
		result[x.name] = x.quantityPerMinute * clock;
	});

	return result;
}

export function getInputResourceFlow(machine: MachineInstance): ResourceFlow {
	return getResourceFlow(machine.template.input, machine.clockSpeed);
}

export function getOutputResourceFlow(machine: MachineInstance): ResourceFlow {
	return getResourceFlow(machine.template.output, machine.clockSpeed);
}
