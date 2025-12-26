<script lang="ts">
	import type { PageProps } from './$types';
	import { cartStore } from '$lib/stores/cartStore.svelte';
	import { Product } from '$lib/types/product.svelte';
	import { CurrencyFormatter } from '$lib/utils/CurrencyFormatter';

	let { data }: PageProps = $props();
</script>

{#snippet productInCart(product: Product)}
	<div class="flex items-start gap-4 rounded-2xl border p-4">
		<img
			src={product.image}
			alt={product.name}
			class="h-full w-16 rounded-2xl bg-white object-cover"
		/>
		<div class="flex w-full justify-between">
			<div class="flex flex-col">
				<div>{product.name}</div>
			</div>
			<div class="flex flex-col items-end">
				<div class="text-gray-500">
					{product.count} x {CurrencyFormatter.format(product.price)} =
				</div>
				<div>{CurrencyFormatter.format(product.count * product.price)}</div>
			</div>
		</div>
	</div>
{/snippet}

<div class="flex flex-col items-center">
	<div class="flex w-full flex-col gap-4">
		{#each cartStore.getProducts as product}
			{@render productInCart(product)}
		{/each}
	</div>
</div>
