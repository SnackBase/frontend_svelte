<script lang="ts">
	import type { PageProps } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data }: PageProps = $props();
</script>

<div class="xs:grid-cols-2 grid grid-cols-2 justify-start gap-4 sm:grid-cols-3 md:grid-cols-4">
	{#each data.product_data as product}
		<ProductCard {product} />
	{/each}
</div>
