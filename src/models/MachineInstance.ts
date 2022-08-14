import { Machine } from './Machine';

export interface MachineInstance {
	name: string;
	template: Machine;
	clockRate: number;
}

export function createMachineInstance(template: Machine): MachineInstance {
	return {
		name: template.name,
		template: template,
		clockRate: 1.0
	};
}
