import { api } from '$lib/server/api-client';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { OrderData } from '$lib/types/order.svelte';

export const load = (async (event) => {
	// Verify the user has customer scope
	const session = await getAuthSession(event);

	// Verify admin scope
	requireScope(session, 'appadmin');

	// Fetch orders from admin endpoint (includes user data)
	const response = await api.get('/admin/orders', session?.accessToken);
	if (!response.ok) {
		error(response.status, { message: await response.text() });
	}
	const order_data: OrderData[] = await response.json();

	return { order_data };
}) satisfies PageServerLoad;

export const actions = {
	delete: async (event) => {
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const formData = await event.request.formData();
		const orderId = formData.get('orderId');

		if (!orderId) {
			return fail(400, { error: 'Order ID is required' });
		}

		const response = await api.delete(`/admin/order/${orderId}`, session?.accessToken);

		if (!response.ok) {
			const errorText = await response.text();
			return fail(response.status, { error: errorText });
		}

		return { success: true };
	}
} satisfies Actions;
