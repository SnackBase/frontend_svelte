import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import type { Provider } from '@auth/sveltekit/providers';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: process.env.AUTH_KEYCLOAK_ID!,
			clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
			issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
			// Request all scopes - Keycloak will only include those the user is authorized for
			authorization: {
				params: {
					scope: 'openid email profile customer appadmin kiosk'
				}
			}
		}) as Provider
	],
	callbacks: {
		// Extract access token and scopes from the account object
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
				// Keycloak returns space-separated scopes
				token.scopes = account.scope?.split(' ') || [];
			}
			return token;
		},
		// Add access token and scopes to the session for use throughout the app
		async session({ session, token }) {
			// Type assertion to add our custom properties
			const extendedSession = session as typeof session & {
				accessToken?: string;
				scopes?: string[];
			};
			extendedSession.accessToken = token.accessToken as string;
			extendedSession.scopes = token.scopes as string[];
			return extendedSession;
		}
	}
});
