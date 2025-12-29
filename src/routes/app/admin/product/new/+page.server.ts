import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const price = data.get('price');
		const type = data.get('type');
		console.log(data);

		return { success: true };
	}
} satisfies Actions;
