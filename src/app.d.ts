// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: () => Promise<{
				user?: {
					name?: string | null;
					email?: string | null;
					image?: string | null;
				};
				accessToken?: string;
				scopes?: string[];
				error?: string; // "RefreshTokenError" when token refresh fails
			} | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
