import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import type { Provider } from '@auth/sveltekit/providers';
import type { JWT } from '@auth/core/jwt';
import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_SECRET, AUTH_KEYCLOAK_ISSUER } from '$env/static/private';

// Buffer time (in seconds) before expiration to trigger refresh
// Refresh 60 seconds before actual expiration to avoid edge cases
const REFRESH_BUFFER_SECONDS = 60;

/**
 * Refresh the access token using Keycloak's token endpoint
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
	const tokenEndpoint = `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

	try {
		const response = await fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: AUTH_KEYCLOAK_ID,
				client_secret: AUTH_KEYCLOAK_SECRET,
				grant_type: 'refresh_token',
				refresh_token: token.refreshToken as string
			})
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			console.error('Token refresh failed:', refreshedTokens);
			throw new Error(refreshedTokens.error_description || 'Token refresh failed');
		}

		console.log('Token refreshed successfully');

		// Return updated token with new values
		return {
			...token,
			accessToken: refreshedTokens.access_token,
			// Calculate new expiration time from expires_in
			expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
			// Update refresh token if a new one was issued (Keycloak may rotate refresh tokens)
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
			// Update scopes if they changed
			scopes: refreshedTokens.scope?.split(' ') || token.scopes,
			// Clear any previous error
			error: undefined
		};
	} catch (error) {
		console.error('Error refreshing access token:', error);

		// Return the token with an error flag
		// This signals to the session callback that re-authentication is needed
		return {
			...token,
			error: 'RefreshTokenError'
		};
	}
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: process.env.AUTH_KEYCLOAK_ID!,
			clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
			issuer: process.env.AUTH_KEYCLOAK_ISSUER!
			// Note: Scopes are automatically included by Keycloak based on client configuration
			// and user roles/groups. No need to explicitly request them here.
		}) as Provider
	],
	pages: {
		// Redirect to root page after sign in, which will handle role-based routing
		signIn: '/'
	},
	callbacks: {
		// Extract access token, refresh token, and expiry from the account object
		async jwt({ token, account }) {
			// Initial sign-in: store all tokens from the account
			if (account) {
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					// expires_at from account is already in Unix seconds
					expiresAt: account.expires_at,
					// Keycloak returns space-separated scopes
					scopes: account.scope?.split(' ') || []
				};
			}

			// Subsequent requests: check if token needs refresh
			const expiresAt = token.expiresAt as number | undefined;

			if (expiresAt) {
				const currentTime = Math.floor(Date.now() / 1000);
				const shouldRefresh = currentTime >= expiresAt - REFRESH_BUFFER_SECONDS;

				if (shouldRefresh) {
					// Token is expired or about to expire, refresh it
					return await refreshAccessToken(token);
				}
			}

			// Token is still valid, return as-is
			return token;
		},

		// Add access token and scopes to the session for use throughout the app
		async session({ session, token }) {
			// Type assertion to add our custom properties
			const extendedSession = session as typeof session & {
				accessToken?: string;
				scopes?: string[];
				error?: string;
			};

			extendedSession.accessToken = token.accessToken as string;
			extendedSession.scopes = token.scopes as string[];

			// Propagate error to session so UI/hooks can handle it
			if (token.error) {
				extendedSession.error = token.error as string;
			}

			return extendedSession;
		}
	}
});
