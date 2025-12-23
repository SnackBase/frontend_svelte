import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import Google from '@auth/sveltekit/providers/google';
// import Keycloak from '@auth/sveltekit/providers/keycloak';  // TODO: include keycloak for local users
import favicon from '$lib/assets/favicon.svg';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [GitHub, Google]
});
