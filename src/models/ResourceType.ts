export enum ResourceType {
	NOTHING = 'nothing',
	// Natural resource section
	IRON_ORE = 'ironOre',
	COPPER_ORE = 'copperOre',
	COAL = 'coal',
	WATER = 'water',
	SULFUR = 'sulfur',
	LIMESTONE = 'limestone',
	// Gen 0 productions
	IRON_INGOT = 'ironIngot',
	COPPER_INGOT = 'copperIngot',
	CONCRETE = 'concrete',
	// Gen 1 productions
	IRON_PLATE = 'ironPlate',
	IRON_ROD = 'ironRod',
	WIRE = 'wire',
	// Gen 2 productions
	PORTABLE_MINER = 'portableMiner',
	SCREW = 'screw',
}

type EnumDict<U extends string | symbol | number, V> = {
	[K in U]: V
};

export const ResourceTypeFriendlyNames: EnumDict<ResourceType, string> = {
	screw: 'Screw',
	coal: 'Coal',
	concrete: 'Concrete',
	copperIngot: 'Copper ingot',
	copperOre: 'Copper ore',
	ironIngot: 'Iron ingot',
	ironOre: 'Iron ore',
	ironPlate: 'Iron plate',
	ironRod: 'Iron rod',
	limestone: 'Limestone',
	nothing: '(Nothing)',
	portableMiner: 'Portable Miner',
	sulfur: 'Sulfur',
	water: 'Water',
	wire: 'Wire'
};
