<script lang="ts">
	import type { PageProps } from './$types';
	import ProductShop from '$lib/components/ProductShop.svelte';

	let { data }: PageProps = $props();
</script>

<ProductShop productData={data.product_data} />
