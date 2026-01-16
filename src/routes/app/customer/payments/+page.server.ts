import { api } from '$lib/server/api-client';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { PaymentData } from '$lib/types/payment.svelte';

export const load = (async (event) => {
	let session = await getAuthSession(event);

	let response = await api.get('/payments', session?.accessToken);
	let payments_data: PaymentData[] = await response.json();

	console.log(payments_data);

	return { payments_data };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		// extract session
		const session = await getAuthSession(event);
		requireScope(session, 'customer');

		// extract form data
		const data = await event.request.formData();
		const amount = data.get('amount');

		// validate data
		if (!amount) {
			return fail(400, { error: 'Amount is required.' });
		}

		const body = { amount: amount };

		// send post request to backend api
		const response = await api.post(`/payments`, body, session?.accessToken);

		if (!response.ok) {
			const errorText = await response.text();
			return fail(response.status, { error: errorText });
		}
		return { success: true };
	}
} satisfies Actions;
