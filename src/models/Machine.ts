import { ResourceUtility } from './ResourceUtility';
import { Resource } from './Resource';
import { ResourceType } from './ResourceType';

export interface Machine {
	name: string;

	input: ResourceUtility[];
	output: ResourceUtility[];

	power: number;
	cost: Resource[];
}

export const Machines: Machine[] = [
	{
		name: 'Miner Mark I (Iron, Impure)',
		input: [],
		output: [
			{name: ResourceType.IRON_ORE, quantityPerMinute: 30}
		],
		power: 5,
		cost: [
			{name: ResourceType.PORTABLE_MINER, quantity: 1},
			{name: ResourceType.IRON_PLATE, quantity: 10},
			{name: ResourceType.CONCRETE, quantity: 10}
		]
	},
	{
		name: 'Miner Mark I (Copper, Impure)',
		input: [],
		output: [
			{name: ResourceType.COPPER_ORE, quantityPerMinute: 30}
		],
		power: 5,
		cost: [
			{name: ResourceType.PORTABLE_MINER, quantity: 1},
			{name: ResourceType.IRON_PLATE, quantity: 10},
			{name: ResourceType.CONCRETE, quantity: 10}
		]
	},
	{
		name: 'Miner Mark I (Limestone, Impure)',
		input: [],
		output: [
			{name: ResourceType.LIMESTONE, quantityPerMinute: 30}
		],
		power: 5,
		cost: [
			{name: ResourceType.PORTABLE_MINER, quantity: 1},
			{name: ResourceType.IRON_PLATE, quantity: 10},
			{name: ResourceType.CONCRETE, quantity: 10}
		]
	},
	{
		name: 'Smelter (Iron Ingot)',
		input: [
			{name: ResourceType.IRON_ORE, quantityPerMinute: 30}
		],
		output: [
			{name: ResourceType.IRON_INGOT, quantityPerMinute: 30}
		],
		power: 4,
		cost: [
			{name: ResourceType.IRON_ROD, quantity: 5},
			{name: ResourceType.WIRE, quantity: 8}
		]
	},
	{
		name: 'Smelter (Copper Ingot)',
		input: [
			{name: ResourceType.COPPER_ORE, quantityPerMinute: 30}
		],
		output: [
			{name: ResourceType.COPPER_INGOT, quantityPerMinute: 30}
		],
		power: 4,
		cost: [
			{name: ResourceType.IRON_ROD, quantity: 5},
			{name: ResourceType.WIRE, quantity: 8}
		]
	}
];

export function getMachineTemplateByName(name: string): Machine | undefined {
	return Machines.find(x => x.name === name);
}
