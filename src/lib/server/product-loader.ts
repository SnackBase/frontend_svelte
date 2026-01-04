import type { ProductData } from '$lib/types/productData.svelte';
import { error } from '@sveltejs/kit';
import { api } from './api-client';

/**
 * Type guard to validate product data structure
 */
function isValidProductData(data: unknown): data is ProductData[] {
	if (!Array.isArray(data)) {
		return false;
	}

	return data.every(
		(item) =>
			typeof item === 'object' &&
			item !== null &&
			typeof item.id === 'number' &&
			typeof item.name === 'string' &&
			typeof item.price === 'number' &&
			typeof item.type === 'string' &&
			typeof item.currency === 'string' &&
			typeof item.image === 'string'
	);
}

/**
 * Loads product data from the API
 * This function can be reused across different routes (customer, kiosk, admin, etc.)
 *
 * @param accessToken - Optional JWT access token for authentication
 */
export async function loadProducts(accessToken?: string): Promise<ProductData[]> {
	try {
		const product_data = await Promise.all([
			// artificial delay TODO: delete
			new Promise((resolve) => setTimeout(resolve, 2_000)),

			// data fetch using api client
			api
				.get('/products', accessToken)
				.then(async (res) => {
					if (!res.ok) {
						throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
					}
					return res.json();
				})
				.then((data: unknown) => {
					if (!isValidProductData(data)) {
						throw new Error('Invalid product data structure received from API');
					}
					return data;
				})
		]).then(([, products]) => products);

		return product_data;
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Failed to load products';
		console.error('Product loading error:', message);
		throw error(500, {
			message: 'Unable to load products. Please try again later.'
		});
	}
}
