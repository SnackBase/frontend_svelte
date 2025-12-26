import type { PageServerLoad } from './$types';
import type { Product } from '$lib/types/product';

export const load = (async () => {
	let product_response = await fetch('http://localhost:5173/mockapi/data.json');
	let product_data: Product[] = await product_response.json();
	// console.log(product_data);
	return { product_data };
}) satisfies PageServerLoad;
