/**
 * Server-side API client for making authenticated requests to the FastAPI backend
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000/api/v1';

interface ApiClientOptions extends RequestInit {
	accessToken?: string;
}

/**
 * Make an authenticated request to the backend API
 * Automatically adds Authorization header if accessToken is provided
 */
export async function apiClient(
	endpoint: string,
	options: ApiClientOptions = {}
): Promise<Response> {
	const { accessToken, headers = {}, ...fetchOptions } = options;

	// Build headers
	const requestHeaders: Record<string, any> = {
		'Content-Type': 'application/json',
		...headers
	};

	// Add Authorization header if token is provided
	if (accessToken) {
		requestHeaders['Authorization'] = `Bearer ${accessToken}`;
	}

	// Remove Content-Type for FormData (browser will set it with boundary)
	if (fetchOptions.body instanceof FormData) {
		delete requestHeaders['Content-Type'];
	}

	// Make the request
	const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

	return fetch(url, {
		...fetchOptions,
		headers: requestHeaders
	});
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
	get: (endpoint: string, accessToken?: string) =>
		apiClient(endpoint, { method: 'GET', accessToken }),

	post: (endpoint: string, body: any, accessToken?: string) =>
		apiClient(endpoint, {
			method: 'POST',
			body: body instanceof FormData ? body : JSON.stringify(body),
			accessToken
		}),

	put: (endpoint: string, body: any, accessToken?: string) =>
		apiClient(endpoint, {
			method: 'PUT',
			body: body instanceof FormData ? body : JSON.stringify(body),
			accessToken
		}),

	patch: (endpoint: string, body: any, accessToken?: string) =>
		apiClient(endpoint, {
			method: 'PATCH',
			body: body instanceof FormData ? body : JSON.stringify(body),
			accessToken
		}),

	delete: (endpoint: string, accessToken?: string) =>
		apiClient(endpoint, { method: 'DELETE', accessToken })
};
