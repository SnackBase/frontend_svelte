import type { PageServerLoad, Actions } from './$types';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/server/api-client';
import { AUTH_KEYCLOAK_ISSUER, AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_SECRET } from '$env/static/private';

// Define the user type for kiosk checkout
export interface KioskUser {
	username: string;
	firstName: string;
	lastName: string;
}

interface TokenData {
	access_token: string;
}

export const load: PageServerLoad = async (event) => {
	// Verify the user has kiosk scope
	const session = await getAuthSession(event);
	requireScope(session, 'kiosk');

	// TODO: Replace with actual backend endpoint to fetch users
	// For now, return mock data
	const users: KioskUser[] = await fetchKioskUsers(session?.accessToken);

	return {
		users
	};
};

/**
 * Fetch the list of users available for kiosk checkout
 * TODO: Replace this with your actual backend endpoint
 */
async function fetchKioskUsers(accessToken?: string): Promise<KioskUser[]> {
	// Mock implementation - replace with actual API call
	// Example: const response = await fetch('http://your-backend/api/users');
	// return await response.json();

	const response = await api.get('/users', accessToken);

	if (!response.ok) {
		throw fail(500, { error: 'Error requesting users form auth server' });
	}

	let users_data: KioskUser[] = await response.json();

	return users_data;
}

export const actions: Actions = {
	checkout: async (event) => {
		const session = await getAuthSession(event);
		if (!session?.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await event.request.formData();
		const items = formData.get('items');
		const selectedUserName = formData.get('userId');
		const userPassword = formData.get('userPassword');

		// Validate required fields
		if (!selectedUserName) {
			return fail(400, { error: 'Please select a user for checkout' });
		}

		if (!userPassword || typeof userPassword !== 'string') {
			return fail(400, { error: 'Please enter the user password' });
		}

		if (!items || typeof items !== 'string') {
			return fail(400, { error: 'Invalid cart items' });
		}

		try {
			const cartItems = JSON.parse(items);

			// Step 1: Authenticate the selected user using Keycloak Direct Access Grant
			const keycloakUrl = AUTH_KEYCLOAK_ISSUER;
			const clientId = AUTH_KEYCLOAK_ID;
			const clientSecret = AUTH_KEYCLOAK_SECRET;

			// Find the user's email/username from the users list
			const users = await fetchKioskUsers(session.accessToken);
			const selectedUser = users.find((u) => u.username === selectedUserName);

			if (!selectedUser) {
				return fail(400, { error: 'Selected user not found' });
			}

			// Authenticate using Keycloak Direct Access Grant (Resource Owner Password Credentials)
			// TODO: Uncomment and configure when ready to use real Keycloak authentication

			const tokenResponse = await event.fetch(`${keycloakUrl}/protocol/openid-connect/token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					grant_type: 'password',
					client_id: clientId!,
					client_secret: clientSecret!,
					username: selectedUser.username, // or selectedUser.username
					password: userPassword
				})
			});

			if (!tokenResponse.ok) {
				const error = await tokenResponse.json();
				console.error('Keycloak auth error:', error);
				return fail(401, { error: 'Invalid credentials. Please check username and password.' });
			}

			const tokenData: TokenData = await tokenResponse.json();
			// tokenData contains: access_token, refresh_token, etc.

			// Step 2: Send checkout request to backend with authenticated user
			// Call the checkout API endpoint with the user's access token
			const response = await event.fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${tokenData.access_token}`
				},
				body: JSON.stringify({ items: cartItems })
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				return fail(response.status, {
					error: result.error || 'Checkout failed'
				});
			}

			// Return success with order details
			return {
				success: true,
				orderId: result.orderId,
				message: result.message
			};
		} catch (error) {
			console.error('Checkout error:', error);
			return fail(500, { error: 'Checkout failed. Please try again.' });
		}
	}
};
