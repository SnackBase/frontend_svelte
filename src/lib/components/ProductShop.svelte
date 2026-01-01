<!--
	ProductShop Component

	A reusable product shop interface that displays a grid of products.
	This component can be used across different routes (customer, kiosk, etc.)
	while maintaining separate server-side authentication and data loading.

	Usage:
	<ProductShop productData={data.product_data} />

	The server-side load function should provide the product data promise.
-->
<script lang="ts">
	import type { ProductData } from '$lib/types/productData.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { cartStore } from '$lib/stores/cartStore.svelte';

	interface ProductShopProps {
		productData: Promise<ProductData[]>;
	}

	let { productData }: ProductShopProps = $props();

	const products = $derived.by(async () => {
		const rawProducts = await productData;
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
{:catch}
	<!-- ERROR -->
	<p class="text-red-500">Failed to load products</p>
{/await}
