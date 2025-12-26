<script lang="ts">
	import type { PageProps } from './$types';
	import { cartStore } from '$lib/stores/cartStore.svelte';
	import { Product } from '$lib/types/product.svelte';
	import { CurrencyFormatter } from '$lib/utils/CurrencyFormatter';

	let { data }: PageProps = $props();
</script>

{#snippet productInCart(product: Product)}
	<div class="flex items-start gap-2 rounded-2xl border p-3">
		<img src={product.image} alt={product.name} class="size-18 rounded-2xl bg-white object-cover" />
		<div class="flex w-full flex-col justify-between">
			<div class="flex flex-col">
				<div>{product.name}</div>
			</div>
			<!-- <div class="flex flex-col items-end"> -->
			<div class="text-gray-500">
				{product.count} x {CurrencyFormatter.format(product.price)}
			</div>
			<div>{CurrencyFormatter.format(product.count * product.price)}</div>
			<!-- </div> -->
		</div>
		<div class="flex flex-col gap-2"></div>
	</div>
{/snippet}

{#if cartStore.totalItems > 0}
	<div class="flex flex-col items-center">
		<div class="flex w-full flex-col gap-4">
			{#each cartStore.getProducts as product}
				{@render productInCart(product)}
			{/each}
		</div>
	</div>
{:else}
	<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
		<p>This Cart is currently Empty.</p>
		<p>
			Visit the <a href="/app/customer/shop" class="border-b text-blue-500 hover:text-sky-500"
				>shop</a
			> to add items to it!
		</p>
	</div>
{/if}
