<script lang="ts">
	import type { ProductData } from '$lib/types/productData.svelte';
	import { Product } from '$lib/types/product.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const products = $derived.by(async () => {
		const rawProducts: ProductData[] = await data.product_data;
		return rawProducts.map((p) => new Product(p));
	});
</script>

{#snippet actions(product: Product)}
	<a
		href="/app/admin/products/{product.id}"
		class="flex w-full items-center justify-center rounded-full border px-4 py-2 font-bold hover:border-blue-500 hover:text-blue-500"
	>
		Edit
	</a>
{/snippet}

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Products</h1>
		<a href="/app/admin/products/new"><ButtonStyle>New Product</ButtonStyle></a>
	</div>

	{#await products}
		<div class="flex justify-center py-16">
			<div
				class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
			></div>
		</div>
	{:then productList}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
			{#each productList as product}
				<ProductCard {product} {actions} />
			{/each}
		</div>
	{:catch}
		<p class="text-red-500">Failed to load products</p>
	{/await}
</div>
