import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuthSession, requireAnyScope } from '$lib/server/auth-utils';
import { api } from '$lib/server/api-client';
import type { OrderData } from '$lib/types/order.svelte';
import type { FastAPIError } from '$lib/types/fastapierror.svelte';

interface CheckoutItem {
	productId: number;
	count: number;
}

interface CheckoutRequest {
	items: CheckoutItem[];
}

export const POST: RequestHandler = async (event) => {
	// Require either customer OR kiosk scope
	const session = await getAuthSession(event);
	requireAnyScope(session, ['customer', 'kiosk']);

	try {
		const body = (await event.request.json()) as CheckoutRequest;

		// Check if there's an Authorization header (from kiosk mode)
		// If present, use that token instead of the session token
		const authHeader = event.request.headers.get('Authorization');
		const accessToken = authHeader?.replace('Bearer ', '') || session?.accessToken;

		// Validate request body
		if (!body.items || !Array.isArray(body.items)) {
			return json(
				{
					success: false,
					error: 'Invalid request: items array is required'
				},
				{ status: 400 }
			);
		}

		// Validate each item
		const invalidItems = body.items.filter(
			(item) =>
				typeof item.productId !== 'number' || typeof item.count !== 'number' || item.count <= 0
		);

		if (invalidItems.length > 0) {
			return json(
				{
					success: false,
					error: 'Invalid items: each item must have productId (number) and count (positive number)'
				},
				{ status: 400 }
			);
		}

		const response = await api.post('/orders', body, accessToken);

		if (!response.ok) {
			const errorData: FastAPIError = await response.json();
			return json(
				{
					success: false,
					error: errorData.detail || 'Checkout failed'
				},
				{ status: response.status }
			);
		}

		const order: OrderData = await response.json();

		const orderId = order.id.toString();

		return json({
			success: true,
			orderId,
			message: 'Checkout completed successfully',
			items: body.items
		});
	} catch (err) {
		console.error('Checkout error:', err);
		return json(
			{
				success: false,
				error: 'An error occurred during checkout'
			},
			{ status: 500 }
		);
	}
};
