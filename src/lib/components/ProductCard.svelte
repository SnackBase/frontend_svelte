<script lang="ts">
	import type { Product } from '$lib/types/product';
	import { CurrencyFormatter } from '$lib/utils/CurrencyFormatter';

	let { product }: { product: Product } = $props();
	let count = $state(0);
</script>

<div
	class="max-w-sm space-y-1 rounded-xl border p-4"
	title="{product.name} - {CurrencyFormatter.format(product.price)}"
>
	<img
		src={product.image}
		alt={product.name}
		class="h-32 w-full rounded-2xl bg-white object-cover"
	/>

	<div class="truncate text-xl font-bold">{product.name}</div>

	<div>
		{CurrencyFormatter.format(product.price)}
	</div>

	<div class="flex w-full overflow-hidden">
		<button
			onclick={() => count > 0 && count--}
			aria-label="Decrease quantity"
			class="group shrink-0 rounded-l-full border-2 py-2 pr-2 pl-4
	       hover:border-blue-500 hover:text-blue-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<path fill="currentColor" d="M6 13h12v-2H6z" />
			</svg>
		</button>
		<div class="min-w-0 flex-1 border-y-2 px-2 py-2 text-center font-bold">
			{count}
		</div>

		<button
			onclick={() => count++}
			aria-label="Increase quantity"
			class="group shrink-0 rounded-r-full border-2 py-2 pr-4 pl-2
	       hover:border-blue-500 hover:text-blue-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<path fill="currentColor" d="M6 13h12v-2H6z" />
				<path fill="currentColor" d="M11 6h2v12h-2z" />
			</svg>
		</button>
	</div>
</div>
