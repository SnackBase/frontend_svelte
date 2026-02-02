import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { api } from '$lib/server/api-client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserData } from '$lib/types/userData.svelte';

export const load = (async (event) => {
	const session = await getAuthSession(event);
	requireScope(session, 'appadmin');

	const response = await api.get('/admin/users', session?.accessToken);
	if (!response.ok) {
		error(response.status, { message: await response.text() });
	}
	const users: UserData[] = await response.json();

	return { users };
}) satisfies PageServerLoad;
