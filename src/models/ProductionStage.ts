import { MachineInstance } from './MachineInstance';

export interface ProductionStage {
	name: string;
	machines: MachineInstance[];
}
