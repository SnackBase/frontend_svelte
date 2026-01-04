import type { PageServerLoad } from './$types';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { loadProducts } from '$lib/server/product-loader';

export const load = (async (event) => {
	// Verify the user has customer scope
	const session = await getAuthSession(event);
	requireScope(session, 'customer');

	// Load products using the shared utility
	const product_data = loadProducts(event.fetch, session?.accessToken);

	return {
		product_data
	};
}) satisfies PageServerLoad;
