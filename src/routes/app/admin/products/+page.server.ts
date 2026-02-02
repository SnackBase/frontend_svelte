import type { PageServerLoad } from './$types';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { loadProducts } from '$lib/server/product-loader';

export const load = (async (event) => {
	const session = await getAuthSession(event);
	requireScope(session, 'appadmin');

	const product_data = loadProducts(session?.accessToken);

	return {
		product_data
	};
}) satisfies PageServerLoad;
