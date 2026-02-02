import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/**
 * Extended session type with Keycloak tokens and scopes
 */
export interface ExtendedSession {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	accessToken?: string;
	scopes?: string[];
	error?: string; // "RefreshTokenError" when token refresh fails
}

/**
 * Check if the user has a specific scope
 */
export function hasScope(session: ExtendedSession | null, scope: string): boolean {
	return session?.scopes?.includes(scope) ?? false;
}

/**
 * Check if the user has ANY of the provided scopes
 */
export function hasAnyScope(session: ExtendedSession | null, scopes: string[]): boolean {
	return scopes.some((scope) => hasScope(session, scope));
}

/**
 * Check if the user has ALL of the provided scopes
 */
export function hasAllScopes(session: ExtendedSession | null, scopes: string[]): boolean {
	return scopes.every((scope) => hasScope(session, scope));
}

/**
 * Require a specific scope - throws 403 if not present
 */
export function requireScope(session: ExtendedSession | null, scope: string): void {
	if (!hasScope(session, scope)) {
		throw error(403, {
			message: `Access denied. Required scope: ${scope}`
		});
	}
}

/**
 * Require ANY of the provided scopes - throws 403 if none are present
 */
export function requireAnyScope(session: ExtendedSession | null, scopes: string[]): void {
	if (!hasAnyScope(session, scopes)) {
		throw error(403, {
			message: `Access denied. Required one of: ${scopes.join(', ')}`
		});
	}
}

/**
 * Get the authenticated session with extended type
 */
export async function getAuthSession(event: RequestEvent): Promise<ExtendedSession | null> {
	return (await event.locals.auth()) as ExtendedSession | null;
}

/**
 * Check if a user is allowed to access a given route based on the current session
 */
export const checkRouteIfAuthorized = ({
	url,
	session
}: {
	url: URL | string;
	session: ExtendedSession;
}): boolean => {
	// Convert string to pathname if needed
	const pathname = typeof url === 'string' ? url : url.pathname;

	// Define protected routes and their required scopes
	const protectedRoutes = [
		{ pattern: /^\/app\/customer/, scope: 'customer' },
		{ pattern: /^\/app\/admin/, scope: 'appadmin' },
		{ pattern: /^\/app\/kiosk/, scope: 'kiosk' }
	];

	// Check if current route needs protection
	for (const { pattern, scope } of protectedRoutes) {
		if (pattern.test(pathname)) {
			if (!hasScope(session, scope)) {
				return false;
			}
		}
	}
	return true;
};
