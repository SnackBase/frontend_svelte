import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { api } from '$lib/server/api-client';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { UserData } from '$lib/types/userData.svelte';

export const load = (async (event) => {
	const session = await getAuthSession(event);
	requireScope(session, 'appadmin');

	const userId = Number(event.params.id);
	if (isNaN(userId)) {
		error(400, { message: 'Invalid user ID' });
	}

	const response = await api.get(`/admin/users/${userId}`, session?.accessToken);
	if (!response.ok) {
		error(response.status, { message: await response.text() });
	}
	const user: UserData = await response.json();

	return { user };
}) satisfies PageServerLoad;

export const actions = {
	update: async (event) => {
		const session = await getAuthSession(event);
		requireScope(session, 'appadmin');

		const userId = Number(event.params.id);
		const data = await event.request.formData();

		const allowedOverdraw = data.get('allowed_overdraw');
		const ageRestrict = data.get('age_restrict');

		if (allowedOverdraw === null) {
			return fail(400, { error: 'Allowed overdraw is required.' });
		}

		const parsedOverdraw = parseFloat(allowedOverdraw.toString());
		if (isNaN(parsedOverdraw) || parsedOverdraw < 0) {
			return fail(422, { error: 'Allowed overdraw must be a valid non-negative number.' });
		}

		try {
			const response = await api.patch(
				`/admin/users/${userId}`,
				{
					allowed_overdraw: parsedOverdraw,
					age_restrict: ageRestrict === 'on'
				},
				session?.accessToken
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					error: errorData.detail || 'Failed to update user.'
				});
			}

			return { success: true };
		} catch (err) {
			console.error('Error updating user:', err);
			return fail(500, { error: 'Failed to connect to backend. Please try again.' });
		}
	}
} satisfies Actions;
