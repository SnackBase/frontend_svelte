import { handle as auth_handle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { getAuthSession, checkRouteIfAuthorized } from '$lib/server/auth-utils';
import { error } from '@sveltejs/kit';

// Redirect /favicon.ico to the favicon.svg file
const faviconHandler: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/favicon.ico') {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/favicon.svg'
			}
		});
	}
	return resolve(event);
};

// Scope-based route protection
const scopeProtection: Handle = async ({ event, resolve }) => {
	const session = await getAuthSession(event);

	if (!checkRouteIfAuthorized({ url: event.url, session: session! })) {
		throw error(403, {
			message: "Access denied. You don't have the required permissions."
		});
	}

	return resolve(event);
};

// Combine all handlers
export const handle = sequence(faviconHandler, auth_handle, scopeProtection);
