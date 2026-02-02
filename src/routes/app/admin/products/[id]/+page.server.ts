import { parseCurrencyInput, PRODUCTS_ENDPOINT } from '$lib/constants/product';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { loadProductById } from '$lib/server/product-loader';
import { apiClient } from '$lib/server/api-client';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ProductData } from '$lib/types/productData.svelte';

export const load = (async (event) => {
	const session = await getAuthSession(event);
	requireScope(session, 'appadmin');

	const productId = Number(event.params.id);
	if (isNaN(productId)) {
		throw fail(400, { error: 'Invalid product ID' });
	}

	const product = await loadProductById(productId, session?.accessToken);

	return { product };
}) satisfies PageServerLoad;

export const actions = {
	updatePrice: async (event) => {
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const productId = Number(event.params.id);
		const data = await event.request.formData();
		const price = data.get('price');

		if (!price) {
			return fail(400, { error: 'Price is required.' });
		}

		const parsedPrice = parseCurrencyInput(price.toString());
		if (parsedPrice <= 0) {
			return fail(422, { error: 'Price must be a valid positive number.' });
		}

		try {
			const response = await apiClient(`${PRODUCTS_ENDPOINT}/${productId}`, {
				method: 'PATCH',
				accessToken: session?.accessToken,
				queryParams: { price: parsedPrice }
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					error: errorData.detail || 'Failed to update product price.'
				});
			}

			const updatedProduct: ProductData = await response.json();
			redirect(303, `/app/admin/products/${updatedProduct.id}`);
		} catch (error) {
			if (isRedirect(error)) throw error;
			console.error('Error updating product price:', error);
			return fail(500, { error: 'Failed to connect to backend. Please try again.' });
		}
	},

	delete: async (event) => {
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const productId = Number(event.params.id);

		try {
			const response = await apiClient(`${PRODUCTS_ENDPOINT}/${productId}`, {
				method: 'DELETE',
				accessToken: session?.accessToken
			});

			if (!response.ok && response.status !== 204) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					error: errorData.detail || 'Failed to delete product.'
				});
			}

			return { success: true, deleted: true };
		} catch (error) {
			console.error('Error deleting product:', error);
			return fail(500, { error: 'Failed to connect to backend. Please try again.' });
		}
	}
} satisfies Actions;
