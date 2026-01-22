import { invalidateAll } from '$app/navigation';
import { toastStore } from '$lib/stores/toast.svelte';
import type { FastAPIError } from '$lib/types/fastapierror.svelte';

/**
 * Parse error message from FastAPI response.
 * Attempts to parse JSON error detail, falls back to raw string.
 */
function parseFastAPIError(errorString: unknown): string | null {
	if (!errorString || typeof errorString !== 'string') return null;
	try {
		const errorData: FastAPIError = JSON.parse(errorString);
		return errorData.detail || null;
	} catch {
		return errorString;
	}
}

export interface FormEnhanceHandlerOptions {
	/** Default error message when parsing fails */
	failureMessage: string;
	/** Error message for unexpected errors */
	errorMessage: string;
	/** Success message to display */
	successMessage: string;
	/** Whether to call invalidateAll() on success (default: true) */
	invalidate?: boolean;
	/** Additional callback to run on success */
	onSuccess?: () => void | Promise<void>;
}

/**
 * Creates a reusable form enhance handler for SvelteKit forms.
 * Handles FastAPI error parsing, toast notifications, and data invalidation.
 *
 * @example
 * use:enhance={createFormEnhanceHandler({
 *   failureMessage: 'Failed to confirm payment',
 *   errorMessage: 'An unexpected error occurred',
 *   successMessage: 'Payment confirmed successfully',
 * })}
 */
export function createFormEnhanceHandler(options: FormEnhanceHandlerOptions) {
	const { failureMessage, errorMessage, successMessage, invalidate = true, onSuccess } = options;

	return () => {
		return async ({ result }: { result: { type: string; data?: Record<string, unknown> } }) => {
			if (result.type === 'failure') {
				const parsedError = parseFastAPIError(result.data?.error);
				toastStore.error(parsedError || failureMessage);
			} else if (result.type === 'error') {
				toastStore.error(errorMessage);
			} else if (result.type === 'success') {
				toastStore.success(successMessage);
				if (invalidate) {
					await invalidateAll();
				}
				if (onSuccess) {
					await onSuccess();
				}
			}
		};
	};
}
