import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Redirect /app/kiosk to /app/kiosk/shop
	throw redirect(303, '/app/kiosk/shop');
};
