<script lang="ts">
	import { Product } from '$lib/types/product.svelte';
	import LockPerson from '$lib/icons/lock-person.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { createFormEnhanceHandler } from '$lib/utils/formEnhanceHandler';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const product = $derived(new Product(data.product));
</script>

<div class="flex min-w-xs flex-col gap-4">
	<!-- Product Details Card -->
	<div class="flex flex-col gap-4 rounded-2xl border p-4">
		<div class="flex flex-row gap-4">
			<img
				src={product.getProxiedImageUrl()}
				alt={product.name}
				class="aspect-square size-18 rounded-2xl bg-white object-cover"
			/>

			<div class="flex w-full flex-col">
				<div class="font-semibold">{product.name}</div>
				<div class="flex flex-col items-end">
					<div class="text-sm text-gray-500">Price</div>
					<div class="text-xl font-bold">{product.getFormattedPrice()}</div>
				</div>
			</div>
		</div>

		<div class="flex flex-row justify-between text-sm text-gray-500">
			<span class="capitalize">{product.type}</span>
			{#if product.ageRestrict}
				<div class="flex items-center gap-1">
					<LockPerson />
					<span>Age restricted</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Update Price Card -->
	<form
		method="POST"
		action="?/updatePrice"
		class="flex flex-col gap-4 rounded-2xl border p-4"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'redirect') {
					toastStore.success('Price updated successfully');
					await goto(result.location);
				} else if (result.type === 'failure') {
					toastStore.error(String(result.data?.error) || 'Failed to update price');
				} else {
					await applyAction(result);
				}
			};
		}}
	>
		<div class="font-semibold">Update Price</div>
		<CurrencyInput id="price" name="price" label="New Price" required />
		<button type="submit">
			<ButtonStyle>Save Price</ButtonStyle>
		</button>
	</form>

	<!-- Delete Product -->
	<div class="flex flex-col gap-4 rounded-2xl border p-4">
		<div class="font-semibold">Delete Product</div>
		<p class="text-sm text-gray-500">Deleting a product is permanent and cannot be undone.</p>
		<form
			method="POST"
			action="?/delete"
			use:enhance={createFormEnhanceHandler({
				failureMessage: 'Failed to delete product',
				errorMessage: 'An unexpected error occurred while deleting the product',
				successMessage: 'Product deleted successfully',
				invalidate: false,
				onSuccess: () => goto('/app/admin/products')
			})}
		>
			<button
				type="submit"
				onclick={(e) => {
					if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) {
						e.preventDefault();
					}
				}}
				class="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
				aria-label="Delete product"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M3 6h18" />
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					<line x1="10" y1="11" x2="10" y2="17" />
					<line x1="14" y1="11" x2="14" y2="17" />
				</svg>
			</button>
		</form>
	</div>
</div>
