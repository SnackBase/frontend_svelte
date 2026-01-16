import { api } from '$lib/server/api-client';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { PaymentData } from '$lib/types/payment.svelte';

export const load = (async (event) => {
	const session = await getAuthSession(event);

	// Verify admin scope
	requireScope(session, 'appadmin');

	// Fetch payments from admin endpoint (includes user data)
	const response = await api.get('/admin/payments', session?.accessToken);
	if (!response.ok) {
		error(response.status, { message: await response.text() });
	}
	const payments_data: PaymentData[] = await response.json();

	return { payments_data };
}) satisfies PageServerLoad;

export const actions = {
	confirm: async (event) => {
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const formData = await event.request.formData();
		const paymentId = formData.get('paymentId');

		if (!paymentId) {
			return fail(400, { error: 'Payment ID is required' });
		}

		const response = await api.put(`/admin/payments/${paymentId}/confirm`, {}, session?.accessToken);

		if (!response.ok) {
			const errorText = await response.text();
			return fail(response.status, { error: errorText });
		}

		return { success: true };
	},
	decline: async (event) => {
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const formData = await event.request.formData();
		const paymentId = formData.get('paymentId');

		if (!paymentId) {
			return fail(400, { error: 'Payment ID is required' });
		}

		const response = await api.put(`/admin/payments/${paymentId}/decline`, {}, session?.accessToken);

		if (!response.ok) {
			const errorText = await response.text();
			return fail(response.status, { error: errorText });
		}

		return { success: true };
	}
} satisfies Actions;
