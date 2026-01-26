import { formatCurrency, type CurrencyConfig } from '$lib/constants/product';
import { configStore } from '$lib/stores/configStore.svelte';
import type { ProductData } from './productData.svelte';

export class Product {
	id: number;
	name: string;
	price: number;
	type: string;
	image: string;
	count = $state(0);
	ageRestrict: boolean;

	constructor(data: ProductData) {
		this.id = data.id;
		this.name = data.name;
		this.price = data.price;
		this.type = data.type;
		this.image = data.image;
		this.ageRestrict = data.ageRestrict;
	}

	// Get currency config from global store
	getCurrencyConfig(): CurrencyConfig {
		return configStore.currency;
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

	// Get the proxied image URL for authenticated image requests
	getProxiedImageUrl(): string {
		// If the image URL is already a full URL (e.g., starts with http/https),
		// we need to extract just the path portion for the proxy
		// Otherwise, use it as-is
		const imagePath = this.image.startsWith('http')
			? new URL(this.image).pathname.substring(1) // Remove leading slash
			: this.image;

		return `/api/images/${imagePath}`;
	}
}
