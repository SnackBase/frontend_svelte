// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ExtendedSession } from '$lib/server/auth-utils';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: () => Promise<ExtendedSession | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
