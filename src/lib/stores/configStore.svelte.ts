import type { CurrencyConfig } from '$lib/constants/product';

const DEFAULT_CURRENCY: CurrencyConfig = {
	name: 'Euro',
	symbol: '€',
	code: 'EUR',
	locale: 'de-DE'
};

class ConfigStore {
	currency = $state<CurrencyConfig>(DEFAULT_CURRENCY);

	setCurrency(config: CurrencyConfig) {
		this.currency = config;
	}
}

export const configStore = new ConfigStore();
