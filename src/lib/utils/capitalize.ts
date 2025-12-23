// Source - https://stackoverflow.com/a/1026087
// Posted by Steve Harrison, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-19, License - CC BY-SA 4.0

export function capitalizeFirstLetter(value: String) {
	return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
