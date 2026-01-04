import type { PageServerLoad, Actions } from './$types';
import { getAuthSession, requireScope } from '$lib/server/auth-utils';
import { fail } from '@sveltejs/kit';
import { api } from '$lib/server/api-client';
import { error } from 'console';

// Define the user type for kiosk checkout
export interface KioskUser {
	username: string;
	firstName: string;
	lastName: string;
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
			const keycloakUrl = process.env.AUTH_KEYCLOAK_ISSUER; // e.g., 'http://localhost:8080/realms/your-realm'
			const clientId = process.env.AUTH_KEYCLOAK_ID;
			const clientSecret = process.env.AUTH_KEYCLOAK_SECRET;

			// Find the user's email/username from the users list
			const users = await fetchKioskUsers(session.accessToken);
			const selectedUser = users.find((u) => u.username === selectedUserName);

			if (!selectedUser) {
				return fail(400, { error: 'Selected user not found' });
			}

			// Authenticate using Keycloak Direct Access Grant (Resource Owner Password Credentials)
			// TODO: Uncomment and configure when ready to use real Keycloak authentication
			/*
			const tokenResponse = await fetch(`${keycloakUrl}/protocol/openid-connect/token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					grant_type: 'password',
					client_id: clientId!,
					client_secret: clientSecret!,
					username: selectedUser.email, // or selectedUser.username
					password: userPassword
				})
			});

			if (!tokenResponse.ok) {
				const error = await tokenResponse.json();
				console.error('Keycloak auth error:', error);
				return fail(401, { error: 'Invalid credentials. Please check username and password.' });
			}

			const tokenData = await tokenResponse.json();
			// tokenData contains: access_token, refresh_token, etc.
			*/

			// Step 2: Send checkout request to backend with authenticated user
			// TODO: Replace with your actual backend endpoint
			/*
			const checkoutResponse = await fetch('http://your-backend/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Optionally include the user's access token
					// 'Authorization': `Bearer ${tokenData.access_token}`
				},
				body: JSON.stringify({
					userId: selectedUserId,
					items: cartItems
				})
			});

			if (!checkoutResponse.ok) {
				throw new Error('Backend checkout failed');
			}

			const checkoutData = await checkoutResponse.json();
			*/

			// Mock success response (remove when implementing real backend)
			const orderId = `ORDER-${Date.now()}`;

			return {
				success: true,
				orderId,
				message: `Order placed for ${selectedUser.firstName}`
			};
		} catch (error) {
			console.error('Checkout error:', error);
			return fail(500, { error: 'Checkout failed. Please try again.' });
		}
	}
};
