import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExtendedSession } from '$lib/server/auth-utils';
import { hasScope } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const session = (await event.locals.auth()) as ExtendedSession | null;

	// If user is authenticated, redirect to their appropriate dashboard
	if (session?.user?.email) {
		// Admin users go to admin dashboard
		if (hasScope(session, 'appadmin')) {
			throw redirect(303, '/app/admin');
		}
		// Customer users go to customer dashboard
		if (hasScope(session, 'customer')) {
			throw redirect(303, '/app/customer');
		}
		// Kiosk users go to kiosk dashboard (when implemented)
		if (hasScope(session, 'kiosk')) {
			throw redirect(303, '/app/kiosk');
		}
	}

	// If not authenticated or no matching scope, stay on landing page
	return {};
};
