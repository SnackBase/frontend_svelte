import { handle as auth_handle } from './auth';

// src/hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

// redirect /favicon.ico to the favicon.svg file
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

// Combine with your auth handle
export const handle = sequence(faviconHandler, auth_handle);
