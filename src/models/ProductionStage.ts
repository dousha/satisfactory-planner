import {
	CalculatedMachineInstance,
	MachineInstance,
} from './MachineInstance';

export interface ProductionStage {
	name: string;
	machines: MachineInstance[];
}

export interface CalculatedProductionStage {
	name: string;
	machines: CalculatedMachineInstance[];
}
