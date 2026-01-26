import { Product } from '$lib/types/product.svelte';
import { formatCurrency } from '$lib/constants/product';
import { configStore } from './configStore.svelte';

class CartStore {
	products = $state<Product[]>([]);
	isLoaded = $state(false);

	get totalItems(): number {
		return this.products.reduce((sum, product) => sum + product.count, 0);
	}

	get totalPrice(): number {
		return this.products.reduce((sum, product) => sum + product.price * product.count, 0);
	}

	get formattedTotalPrice(): string {
		return formatCurrency(this.totalPrice, configStore.currency);
	}

	get cartItems(): Product[] {
		return this.products.filter((p) => p.count > 0);
	}

	loadProducts(rawProducts: any[]): void {
		if (this.isLoaded) {
			// Products already loaded, don't replace them
			return;
		}
		this.products = rawProducts.map((p) => new Product(p));
		this.isLoaded = true;
	}

	clearCart(): void {
		this.products.forEach((product) => {
			product.count = 0;
		});
	}
}

export const cartStore = new CartStore();
