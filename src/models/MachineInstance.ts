import { Machine } from './Machine';

export interface MachineInstance {
	name: string;
	template: Machine;
	clockSpeed: number;
}

export function createMachineInstance(template: Machine): MachineInstance {
	return {
		name: template.name,
		template: template,
		clockSpeed: 1.0
	};
}
