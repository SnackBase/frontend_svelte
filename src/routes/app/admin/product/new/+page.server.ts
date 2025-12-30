import { Product } from '$lib/types/product.svelte';
import type { ProductData } from '$lib/types/productData.svelte';
import { parseCurrencyInput, PRODUCT_TYPES, CURRENCIES } from '$lib/constants/product';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export interface CreateProductResponse {
	success?: boolean;
	missing?: boolean;
	details?: string;
	product?: ProductData;
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const price = data.get('price');
		const type = data.get('type');
		const currency = data.get('currency');
		const image = data.get('image');

		// Validate required fields
		if (!name) return fail(400, { missing: true, details: 'Product name is required.' });
		if (!price) return fail(400, { missing: true, details: 'Price is required.' });
		if (!type) return fail(400, { missing: true, details: 'Product type is required.' });
		if (!currency) return fail(400, { missing: true, details: 'Currency is required.' });
		if (!image) return fail(400, { missing: true, details: 'Image URL is required.' });

		// Validate product type against enum
		if (!PRODUCT_TYPES.includes(type.toString() as any)) {
			return fail(422, {
				missing: true,
				details: `Invalid product type. Must be one of: ${PRODUCT_TYPES.join(', ')}`
			});
		}

		// Validate currency against available currencies
		if (!CURRENCIES.some((c) => c.code === currency.toString())) {
			return fail(422, {
				missing: true,
				details: `Invalid currency. Must be one of: ${CURRENCIES.map((c) => c.code).join(', ')}`
			});
		}

		// Validate image URL format
		try {
			new URL(image.toString());
		} catch {
			return fail(422, {
				missing: true,
				details: 'Image URL must be a valid URL.'
			});
		}

		// Parse and validate price (handles both comma and dot as decimal separator)
		const parsedPrice = parseCurrencyInput(price.toString());
		if (parsedPrice <= 0) {
			return fail(422, {
				missing: true,
				details: 'Price must be a valid positive number.'
			});
		}

		let product: ProductData = {
			id: 0, //TODO: replace with backend api request to get real id
			name: name.toString(),
			price: parsedPrice,
			type: type.toString(),
			currency: currency.toString(),
			image: image.toString()
		};

		return { success: true, product: product } satisfies CreateProductResponse;
	}
} satisfies Actions;
