import { api } from '$lib/server/api-client';
import { getAuthSession } from '$lib/server/auth-utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	// Verify the user has customer scope
	const session = await getAuthSession(event);
	let response = await api.get('/orders', session?.accessToken);
	if (!response.ok) {
		error(response.status, { message: await response.text() });
	}
	const order_data = await response.json();

	return { order_data };
}) satisfies PageServerLoad;
