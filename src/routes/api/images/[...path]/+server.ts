import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getAuthSession } from '$lib/server/auth-utils';
import { api } from '$lib/server/api-client';

/**
 * Proxy endpoint for fetching images from the backend with authentication
 * This allows HTML <img> tags to display images that require authorization headers
 */
export const GET: RequestHandler = async (event) => {
	const session = await getAuthSession(event);

	// Get the image path from the route parameter
	const imagePath = event.params.path;
	console.log(imagePath);

	if (!imagePath) {
		throw error(400, 'Image path is required');
	}

	try {
		// Fetch the image from the backend API with authentication
		const response = await api.get(imagePath, session?.accessToken);

		if (!response.ok) {
			throw error(response.status, `Failed to fetch image: ${response.statusText}`);
		}

		// Get the image data as a blob
		const imageBlob = await response.blob();

		// Get content type from the response or default to a common image type
		const contentType = response.headers.get('content-type') || 'image/webp';

		// Return the image with appropriate headers
		return new Response(imageBlob, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (err) {
		console.error('Image proxy error:', err);
		throw error(500, 'Failed to load image');
	}
};
