import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuthSession, requireAnyScope } from '$lib/server/auth-utils';

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
				typeof item.productId !== 'number' ||
				typeof item.count !== 'number' ||
				item.count <= 0
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

		// Simulate processing delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Dummy checkout logic - in a real app, this would:
		// - Verify product availability
		// - Calculate total price
		// - Process payment
		// - Create order record
		// - Send confirmation email

		const orderId = Math.random().toString(36).substring(2, 15);

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
