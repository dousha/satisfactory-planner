import { CalculatedProductionStage, ProductionStage } from './ProductionStage';
import { addResourceFlow, divideResourceFlow, ResourceFlow, subtractResourceFlow } from './ResourceFlow';
import { CalculatedMachineInstance, getInputResourceFlow } from './MachineInstance';

export interface ProductionPipeline {
	name: string;
	stages: ProductionStage[];
}

function groupBy<T extends Record<string, any>>(xs: T[], key: string): Record<string, T[]> {
	return xs.reduce(function(rv: Record<string, T[]>, x: T) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
}

export class CalculatedProductionPipeline {
	public constructor(pipeline: ProductionPipeline) {
		this.name = pipeline.name;
		this.stages = [];

		const currentStageInput: ResourceFlow = {};

		for (let i = 0; i < pipeline.stages.length; i++) {
			const currentMachines = groupBy(pipeline.stages[i].machines, 'priority');
			const keys = Object.keys(currentMachines).sort().reverse();
			const calculatedMachines: CalculatedMachineInstance[] = [];

			keys.forEach(key => {
				const levelMachine = currentMachines[key];
				levelMachine.forEach(machine => {
					const requiredInput = getInputResourceFlow(machine);
					const utilityRate = divideResourceFlow(currentStageInput, requiredInput);
					const calculatedMachine = new CalculatedMachineInstance(machine, utilityRate);
					calculatedMachines.push(calculatedMachine);
					subtractResourceFlow(currentStageInput, calculatedMachine.getInputResourceFlow());
				});
			});

			calculatedMachines.forEach(machine => addResourceFlow(currentStageInput, machine.getOutputResourceFlow()));

			const currentCalculatedStage = {
				name: pipeline.stages[i].name,
				machines: calculatedMachines,
			} as CalculatedProductionStage;
			this.stages.push(currentCalculatedStage);
		}
	}

	public readonly name: string;
	public readonly stages: CalculatedProductionStage[];
}
