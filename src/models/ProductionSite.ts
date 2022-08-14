import { ProductionPipeline } from './ProductionPipeline';
import { randomIdString } from '../util/Random';

export interface ProductionSite {
	name: string;
	lastEditTime: number;
	pipelines: ProductionPipeline[];
}

export function createNewSite(): ProductionSite {
	return {
		name: `New Production Site #${randomIdString()}`,
		lastEditTime: Date.now(),
		pipelines: []
	}
}
