import { CURRENCIES, formatCurrency, type CurrencyConfig } from '$lib/constants/product';

export class Product {
	id: number;
	name: string;
	price: number;
	type: string;
	currency: string;
	image: string;
	count = $state(0);

	constructor(data: {
		id: number;
		name: string;
		price: number;
		type: string;
		currency: string;
		currencySymbol: string;
		image: string;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.price = data.price;
		this.type = data.type;
		this.currency = data.currency;
		this.image = data.image;
	}

	// Get currency config based on currency name or symbol
	getCurrencyConfig(): CurrencyConfig {
		return CURRENCIES.find((c) => c.code === this.currency) || CURRENCIES[0];
	}

	// Format price with currency
	getFormattedPrice(): string {
		return formatCurrency(this.price, this.getCurrencyConfig());
	}

	// Format total price (price * count) with currency
	getFormattedTotal(): string {
		return formatCurrency(this.price * this.count, this.getCurrencyConfig());
	}

	increment(): void {
		this.count++;
	}

	decrement(): void {
		if (this.count > 0) {
			this.count--;
		}
	}
}
