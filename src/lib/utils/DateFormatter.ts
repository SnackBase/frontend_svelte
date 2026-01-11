export const DateFormatter = (date: string | number | Date) => {
	return new Date(date).toLocaleDateString('de-DE', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
};
