import type { PageServerLoad } from '../$types';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { loadProducts } from '$lib/server/product-loader';

export const load = (async (event) => {
	// Verify the user has kiosk scope
	const session = await getAuthSession(event);
	requireScope(session, 'kiosk');

	// Load products using the same shared utility
	// The UI component will be identical, but the authentication is different
	const product_data = loadProducts(event.fetch);

	return {
		product_data
	};
}) satisfies PageServerLoad;
