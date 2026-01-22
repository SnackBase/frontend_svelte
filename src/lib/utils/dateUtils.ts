/**
 * Convert a string or Date value to a Date object.
 * If the value is already a Date, returns it unchanged.
 * If the value is a string, parses it as a Date.
 */
export function toDate(value: string | Date): Date {
	return typeof value === 'string' ? new Date(value) : value;
}

/**
 * Convert a nullable string or Date value to a Date object or null.
 * Returns null if the value is null or undefined.
 */
export function toDateOrNull(value: string | Date | null | undefined): Date | null {
	if (!value) return null;
	return typeof value === 'string' ? new Date(value) : value;
}
