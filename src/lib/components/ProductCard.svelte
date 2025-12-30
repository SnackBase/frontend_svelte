<script lang="ts">
	import type { Product } from '$lib/types/product.svelte';

	let { product }: { product: Product } = $props();
</script>

<div
	class="max-w-sm space-y-1 rounded-xl border p-4"
	title="{product.name} - {product.getFormattedPrice()}"
>
	<img
		src={product.image}
		alt={product.name}
		class="h-32 w-full rounded-2xl bg-white object-contain"
	/>

	<div class="truncate text-xl font-bold">{product.name}</div>

	<div>
		{product.getFormattedPrice()}
	</div>

	<div class="flex w-full overflow-hidden">
		<button
			onclick={() => product.decrement()}
			aria-label="Decrease quantity"
			class="group sm:p-l-2 shrink-0 rounded-l-full border-2 p-2
	       hover:border-blue-500 hover:text-blue-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<path fill="currentColor" d="M6 13h12v-2H6z" />
			</svg>
		</button>
		<div class="min-w-0 flex-1 border-y-2 px-2 py-2 text-center font-bold">
			{product.count}
		</div>

		<button
			onclick={() => product.increment()}
			aria-label="Increase quantity"
			class="group sm:p-l-2 shrink-0 rounded-r-full border-2 p-2
	       hover:border-blue-500 hover:text-blue-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<path fill="currentColor" d="M6 13h12v-2H6z" />
				<path fill="currentColor" d="M11 6h2v12h-2z" />
			</svg>
		</button>
	</div>
</div>
