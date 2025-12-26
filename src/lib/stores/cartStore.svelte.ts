import { Product } from '$lib/types/product.svelte';

class CartStore {
	products = $state<Product[]>([]);
	isLoaded = $state(false);

	get totalItems(): number {
		return this.products.reduce((sum, product) => sum + product.count, 0);
	}

	get totalPrice(): number {
		return this.products.reduce((sum, product) => sum + product.price * product.count, 0);
	}

	get itemsInCart(): Product[] {
		return this.products.filter((p) => p.count > 0);
	}

	get getProducts(): Product[] {
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
}

export const cartStore = new CartStore();
