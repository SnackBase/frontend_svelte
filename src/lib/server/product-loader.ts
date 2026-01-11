import type { ProductData } from '$lib/types/productData.svelte';
import { error } from '@sveltejs/kit';
import { api } from './api-client';

/**
 * Type guard to validate a single product data structure
 */
function isValidSingleProductData(data: unknown): data is ProductData {
	return (
		typeof data === 'object' &&
		data !== null &&
		'id' in data &&
		typeof data.id === 'number' &&
		'name' in data &&
		typeof data.name === 'string' &&
		'price' in data &&
		typeof data.price === 'number' &&
		'type' in data &&
		typeof data.type === 'string' &&
		'currency' in data &&
		typeof data.currency === 'string' &&
		'image' in data &&
		typeof data.image === 'string'
	);
}

/**
 * Type guard to validate product data structure
 */
function isValidProductData(data: unknown): data is ProductData[] {
	if (!Array.isArray(data)) {
		return false;
	}

	return data.every(isValidSingleProductData);
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
		]).then(([products]) => products);

		return product_data;
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Failed to load products';
		console.error('Product loading error:', message);
		throw error(500, {
			message: 'Unable to load products. Please try again later.'
		});
	}
}

/**
 * Loads a single product by ID from the API
 * This is useful for retrieving historic products that may no longer be available
 *
 * @param productId - The ID of the product to load
 * @param accessToken - Optional JWT access token for authentication
 */
export async function loadProductById(
	productId: number,
	accessToken?: string
): Promise<ProductData> {
	try {
		const response = await api.get(`/products/${productId}`, accessToken);

		if (!response.ok) {
			throw new Error(`Failed to fetch product ${productId}: ${response.status} ${response.statusText}`);
		}

		const data: unknown = await response.json();

		if (!isValidSingleProductData(data)) {
			throw new Error('Invalid product data structure received from API');
		}

		return data;
	} catch (err) {
		const message = err instanceof Error ? err.message : `Failed to load product ${productId}`;
		console.error('Product loading error:', message);
		throw error(500, {
			message: `Unable to load product ${productId}. Please try again later.`
		});
	}
}
