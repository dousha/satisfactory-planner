import { ResourceUtility } from './ResourceUtility';
import { Resource } from './Resource';

export interface Machine {
	name: string;

	input: ResourceUtility[];
	output: ResourceUtility[];

	power: number;
	cost: Resource[];
}

export const Machines: Machine[] = [

];
