import { ProductionSite } from '../models/ProductionSite';

class Storage {
	constructor() {
		if (window.localStorage) {
			const saved = window.localStorage.getItem(this.storageKey);
			if (saved != null && typeof saved === 'string') {
				try {
					console.log('Loading data');
					const obj = JSON.parse(saved);
					if (Array.isArray(obj)) {
						this.productionSites = obj;
					} else {
						console.log('Corrupted data');
						this.productionSites = [];
					}
				} catch (e) {
					this.productionSites = [];
				}
			} else {
				console.log('No saved sites');
				this.productionSites = [];
			}
		} else {
			console.log('Browser does not support localStorage');
			this.productionSites = [];
		}
	}

	public getSavedProductionSites(): ProductionSite[] {
		return this.productionSites;
	}

	public getProductionSite(id: number): ProductionSite {
		if (id >= this.productionSites.length) {
			throw new Error();
		}

		return this.productionSites[id];
	}

	public saveSite(id: number, site: ProductionSite) {
		if (id >= this.productionSites.length) {
			throw new Error();
		}

		site.lastEditTime = Date.now();
		this.productionSites[id] = site;
	}

	public addNewSite(site: ProductionSite) {
		this.productionSites.push(site);
		return this.productionSites.length - 1;
	}

	public deleteSite(index: number) {
		this.productionSites.splice(index);
	}

	public commit() {
		if (!window.localStorage) {
			console.error('LocalStorage not supported');
			return;
		}

		const content = JSON.stringify(this.productionSites);
		window.localStorage.setItem(this.storageKey, content);
	}

	public exportToFile() {
		// TODO
	}

	private readonly productionSites: ProductionSite[];

	private readonly storageKey = 'productionSites';
}

export const StorageInstance = new Storage();
