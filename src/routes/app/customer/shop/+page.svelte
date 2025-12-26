<script lang="ts">
	import type { PageProps } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data }: PageProps = $props();
</script>

{#await data.product_data}
	<!-- LOADING -->
	<div class="flex justify-center py-16">
		<div
			class="h-10 w-10 animate-spin rounded-full
			       border-4 border-gray-300
			       border-t-blue-500"
		></div>
	</div>
{:then products}
	<!-- DATA -->
	<div
		class="grid grid-cols-2 gap-4
		       sm:grid-cols-3 md:grid-cols-4"
	>
		{#each products as product}
			<ProductCard {product} />
		{/each}
	</div>
{:catch error}
	<!-- ERROR -->
	<p class="text-red-500">Failed to load products</p>
{/await}
