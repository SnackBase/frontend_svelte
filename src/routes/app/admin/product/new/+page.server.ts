import { Product } from '$lib/types/product.svelte';
import type { ProductData } from '$lib/types/productData.svelte';
import {
	parseCurrencyInput,
	PRODUCT_TYPES,
	CURRENCIES,
	ALLOWED_IMAGE_TYPES,
	MAX_FILE_SIZE,
	PRODUCTS_ENDPOINT
} from '$lib/constants/product';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';

export interface CreateProductResponse {
	success?: boolean;
	missing?: boolean;
	details?: string;
	product?: ProductData;
}

export const actions = {
	default: async (event) => {
		// Verify admin scope BEFORE processing form
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const data = await event.request.formData();
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
		if (!image) return fail(400, { missing: true, details: 'Product image is required.' });

		// Validate image is a File object and not empty
		if (!(image instanceof File)) {
			return fail(422, {
				missing: true,
				details: 'Invalid image file. Please select an image file.'
			});
		}

		if (image.size === 0) {
			return fail(422, {
				missing: true,
				details: 'Product image is required. Please select a file.'
			});
		}

		// Validate image file type
		if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
			return fail(422, {
				missing: true,
				details: `Invalid image type. Allowed types: PNG, JPEG, JPG`
			});
		}

		// Validate image file size
		if (image.size > MAX_FILE_SIZE) {
			return fail(422, {
				missing: true,
				details: `Image file is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
			});
		}

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

		// Parse and validate price (handles both comma and dot as decimal separator)
		const parsedPrice = parseCurrencyInput(price.toString());
		if (parsedPrice <= 0) {
			return fail(422, {
				missing: true,
				details: 'Price must be a valid positive number.'
			});
		}

		// Send product data to FastAPI backend
		try {
			// Create FormData to send to backend (includes file upload)
			const backendFormData = new FormData();
			backendFormData.append('name', name.toString());
			backendFormData.append('price', parsedPrice.toString());
			backendFormData.append('type', type.toString());
			backendFormData.append('currency', currency.toString());
			backendFormData.append('image', image); // File object

			// TODO: Replace with your actual FastAPI backend URL
			const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

			const response = await fetch(`${backendUrl}${PRODUCTS_ENDPOINT}`, {
				method: 'POST',
				body: backendFormData
				// Note: Don't set Content-Type header - browser will set it with boundary for multipart/form-data
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				console.error('Backend error:', errorData);
				return fail(response.status, {
					missing: true,
					details: errorData.detail || 'Failed to create product on backend'
				});
			}

			const product: ProductData = await response.json();

			return { success: true, product } satisfies CreateProductResponse;
		} catch (error) {
			console.error('Error creating product:', error);
			return fail(500, {
				missing: true,
				details: 'Failed to connect to backend. Please try again.'
			});
		}
	}
} satisfies Actions;
