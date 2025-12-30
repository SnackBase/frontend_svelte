import { handle as auth_handle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { getAuthSession, hasScope } from '$lib/server/auth-utils';
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

	// Define protected routes and their required scopes
	const protectedRoutes = [
		{ pattern: /^\/app\/customer/, scope: 'customer' },
		{ pattern: /^\/app\/admin/, scope: 'appadmin' },
		{ pattern: /^\/app\/kiosk/, scope: 'kiosk' }
	];

	// Check if current route needs protection
	for (const { pattern, scope } of protectedRoutes) {
		if (pattern.test(event.url.pathname)) {
			if (!hasScope(session, scope)) {
				throw error(403, {
					message: `Access denied. You don't have the required permissions.`
				});
			}
		}
	}

	return resolve(event);
};

// Combine all handlers
export const handle = sequence(faviconHandler, auth_handle, scopeProtection);
