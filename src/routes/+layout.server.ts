import type { LayoutServerLoad } from './$types';
import type { ExtendedSession } from '$lib/server/auth-utils';
import { checkRouteIfAuthorized, hasAnyScope } from '$lib/server/auth-utils';

interface NavBarLink {
	name: string;
	route: string;
}

export const load: LayoutServerLoad = async (event) => {
	const session = (await event.locals.auth()) as ExtendedSession | null;

	// Define all possible navbar links with their required scopes
	const navbarLinks: NavBarLink[] = [];

	if (session?.user?.email) {
		// Shop link - requires 'customer' scope
		if (checkRouteIfAuthorized({ url: '/app/customer/shop', session: session })) {
			navbarLinks.push({ name: 'Shop', route: 'app/customer/shop' });
		}
		// Orders link - requires 'customer' scope
		if (checkRouteIfAuthorized({ url: '/app/customer/orders', session: session })) {
			navbarLinks.push({ name: 'Orders', route: 'app/customer/orders' });
		}
		// Payments link - requires 'customer' scope
		if (checkRouteIfAuthorized({ url: '/app/customer/payments', session: session })) {
			navbarLinks.push({ name: 'Payments', route: 'app/customer/payments' });
		}

		// Admin link - requires 'appadmin' scope
		if (checkRouteIfAuthorized({ url: '/app/admin', session: session })) {
			navbarLinks.push({ name: 'Admin', route: 'app/admin' });
		}

		// Admin Orders link - requires 'appadmin' scope
		if (checkRouteIfAuthorized({ url: '/app/admin/orders', session: session })) {
			navbarLinks.push({ name: 'Orders', route: 'app/admin/orders' });
		}

		// Admin Payments link - requires 'appadmin' scope
		if (checkRouteIfAuthorized({ url: '/app/admin/payments', session: session })) {
			navbarLinks.push({ name: 'Payments', route: 'app/admin/payments' });
		}

		// Kiosk link - requires 'kiosk' scope
		if (checkRouteIfAuthorized({ url: '/app/kiosk/shop', session: session })) {
			navbarLinks.push({ name: 'Kiosk', route: 'app/kiosk/shop' });
		}
	}

	// Shopping cart is visible for customer and kiosk users
	const showShoppingCart = session?.user?.email
		? hasAnyScope(session, ['customer', 'kiosk'])
		: false;

	// Determine cart URL based on user scope
	let cartUrl = '/app/customer/cart'; // default
	if (session?.scopes?.includes('kiosk')) {
		cartUrl = '/app/kiosk/cart';
	} else if (session?.scopes?.includes('customer')) {
		cartUrl = '/app/customer/cart';
	}

	return {
		session: session
			? {
					user: session.user,
					scopes: session.scopes
				}
			: null,
		navbarLinks,
		showShoppingCart,
		cartUrl
	};
};
