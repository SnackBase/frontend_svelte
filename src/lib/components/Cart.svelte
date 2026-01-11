<!--
	Cart Component

	A reusable shopping cart interface that displays cart items and handles checkout.
	Supports two modes:
	- Regular mode: Checkout as the logged-in user
	- Kiosk mode: Select a user before checkout

	Usage:
	<Cart mode="customer" shopUrl="/app/customer/shop" />
	<Cart mode="kiosk" shopUrl="/app/kiosk/shop" />
-->
<script lang="ts">
	import { cartStore } from '$lib/stores/cartStore.svelte';
	import type { Product } from '$lib/types/product.svelte';
	import { enhance } from '$app/forms';

	interface CartProps {
		mode: 'customer' | 'kiosk';
		shopUrl: string;
		userSelectionSnippet?: import('svelte').Snippet;
	}

	let { mode, shopUrl, userSelectionSnippet }: CartProps = $props();

	let isCheckingOut = $state(false);
	let checkoutError = $state<string | null>(null);
	let checkoutForm = $state<HTMLFormElement>();

	function handleCheckoutClick() {
		if (!checkoutForm) return;

		// Update hidden input with current cart items
		const items = cartStore.getProducts.map((product) => ({
			productId: product.id,
			count: product.count
		}));

		const itemsInput = checkoutForm.querySelector('input[name="items"]') as HTMLInputElement;
		if (itemsInput) {
			itemsInput.value = JSON.stringify(items);
		}

		// Submit the form
		checkoutForm.requestSubmit();
	}

	function handleClearCart() {
		if (confirm('Are you sure you want to clear the cart?')) {
			cartStore.clearCart();
		}
	}
</script>

{#snippet productInCart(product: Product)}
	<div class="flex gap-3 rounded-2xl border p-3">
		<img
			src={product.getProxiedImageUrl()}
			alt={product.name}
			class="size-18 rounded-2xl bg-white object-cover"
		/>

		<div class="flex flex-1 flex-col justify-between">
			<div class="font-semibold">{product.name}</div>

			<div class="flex flex-row justify-between gap-4">
				<div class="flex items-center gap-2">
					<button
						onclick={() => product.decrement()}
						aria-label="Decrease quantity"
						class="flex size-8 items-center justify-center rounded-full border hover:border-blue-500 hover:text-blue-500"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
							<path fill="currentColor" d="M6 13h12v-2H6z" />
						</svg>
					</button>
					<div class="min-w-8 text-center font-bold">{product.count}</div>
					<button
						onclick={() => product.increment()}
						aria-label="Increase quantity"
						class="flex size-8 items-center justify-center rounded-full border hover:border-blue-500 hover:text-blue-500"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
							<path fill="currentColor" d="M6 13h12v-2H6z" />
							<path fill="currentColor" d="M11 6h2v12h-2z" />
						</svg>
					</button>
				</div>

				<div class="flex flex-col justify-between text-right">
					<div class="text-sm text-gray-500">
						{product.count} × {product.getFormattedPrice()}
					</div>
					<div class="font-bold">
						{product.getFormattedTotal()}
					</div>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#if cartStore.totalItems > 0}
	<div class="flex flex-col items-center">
		<div class="flex w-full flex-col gap-4">
			{#each cartStore.getProducts as product}
				{@render productInCart(product)}
			{/each}
		</div>

		<!-- Gradient separator line -->
		<div class="my-6 h-1 w-full bg-linear-to-r from-sky-500 via-purple-500 to-pink-500"></div>

		<!-- Total and Checkout Section -->
		<div class="flex w-full flex-col gap-4">
			<!-- Total -->
			<div class="flex items-center justify-between text-xl font-bold">
				<span>Total:</span>
				<span>{cartStore.formattedTotalPrice}</span>
			</div>

			<!-- Clear Cart Button -->
			<button
				type="button"
				onclick={handleClearCart}
				class="w-full rounded-full border border-red-500 px-6 py-2 font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white"
			>
				Clear Cart
			</button>

			<!-- Error Message -->
			{#if checkoutError}
				<div class="rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-400">
					{checkoutError}
				</div>
			{/if}

			<!-- Checkout Form -->
			<form
				bind:this={checkoutForm}
				method="POST"
				action="?/checkout"
				use:enhance={() => {
					isCheckingOut = true;
					checkoutError = null;

					return async ({ result, update }) => {
						if (result.type === 'success') {
							// Success - show order ID
							const data = result.data as { success?: boolean; orderId?: string };
							if (data?.success && data.orderId) {
								alert(`Checkout successful! Order ID: ${data.orderId}`);
								// Clear cart after successful checkout
								cartStore.clearCart();
							}
						} else if (result.type === 'failure') {
							// Show error message
							const data = result.data as { error?: string };
							checkoutError = data?.error || 'Checkout failed';
						}

						isCheckingOut = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="items" value="" />

				<!-- Kiosk mode: User selection -->
				{#if mode === 'kiosk' && userSelectionSnippet}
					{@render userSelectionSnippet()}
				{/if}

				<button
					type="button"
					onclick={handleCheckoutClick}
					disabled={isCheckingOut}
					class="group relative w-full rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="flex items-center justify-center gap-2">
						Checkout
						{#if isCheckingOut}
							<svg
								class="size-5 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								class="transition-transform group-hover:translate-x-1"
							>
								<path
									fill="currentColor"
									d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
								/>
							</svg>
						{/if}
					</span>
				</button>
			</form>
		</div>
	</div>
{:else}
	<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
		<p>This Cart is currently Empty.</p>
		<p>
			Visit the <a href={shopUrl} class="border-b text-blue-500 hover:text-sky-500">shop</a> to add items
			to it!
		</p>
	</div>
{/if}
