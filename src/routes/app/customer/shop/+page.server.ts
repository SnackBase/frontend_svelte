import type { PageServerLoad } from './$types';

export const load = (async () => {
	const product_data = Promise.all([
		// artificial delay TODO: delete
		new Promise((resolve) => setTimeout(resolve, 1_000)),

		// data fetch
		fetch('http://localhost:5173/mockapi/data.json').then((res) => res.json())
	]).then(([, products]) => products);

	return {
		product_data
	};
}) satisfies PageServerLoad;
