import { ProductionStage } from './ProductionStage';

export interface ProductionPipeline {
	name: string;
	stages: ProductionStage[];
}
