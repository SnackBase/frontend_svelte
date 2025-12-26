import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

interface CheckoutItem {
	productId: number;
	count: number;
}

export const actions = {
	checkout: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const itemsJson = formData.get('items');

			if (!itemsJson || typeof itemsJson !== 'string') {
				return fail(400, {
					error: 'Invalid request: items data is required'
				});
			}

			let items: CheckoutItem[];
			try {
				items = JSON.parse(itemsJson);
			} catch {
				return fail(400, {
					error: 'Invalid request: items must be valid JSON'
				});
			}

			// Validate items array
			if (!Array.isArray(items)) {
				return fail(400, {
					error: 'Invalid request: items must be an array'
				});
			}

			// Validate each item
			const invalidItems = items.filter(
				(item) =>
					typeof item.productId !== 'number' ||
					typeof item.count !== 'number' ||
					item.count <= 0
			);

			if (invalidItems.length > 0) {
				return fail(400, {
					error: 'Invalid items: each item must have productId (number) and count (positive number)'
				});
			}

			// Call the checkout API endpoint
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ items })
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
		} catch (err) {
			console.error('Checkout action error:', err);
			return fail(500, {
				error: 'An error occurred during checkout'
			});
		}
	}
} satisfies Actions;
