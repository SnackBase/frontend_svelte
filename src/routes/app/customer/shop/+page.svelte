<script lang="ts">
	import type { PageProps } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { Product } from '$lib/types/product.svelte';
	import { cartStore } from '$lib/stores/cartStore.svelte';

	let { data }: PageProps = $props();

	const products = $derived.by(async () => {
		const rawProducts = await data.product_data;
		cartStore.loadProducts(rawProducts);
		return cartStore.products;
	});
</script>

{#await products}
	<!-- LOADING -->
	<div class="flex justify-center py-16">
		<div
			class="h-10 w-10 animate-spin rounded-full
			       border-4 border-gray-300
			       border-t-blue-500"
		></div>
	</div>
{:then productList}
	<!-- DATA -->
	<div
		class="grid grid-cols-2 gap-4
		       sm:grid-cols-3 md:grid-cols-4"
	>
		{#each productList as product}
			<ProductCard {product} />
		{/each}
	</div>
{:catch error}
	<!-- ERROR -->
	<p class="text-red-500">Failed to load products</p>
{/await}
