<script lang="ts">
	import { Order, type OrderData } from '$lib/types/order.svelte';
	import { User } from '$lib/types/userData.svelte';
	import OrderDisplay from '$lib/components/OrderDisplay.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { PageProps } from './$types';
	import type { FastAPIError } from '$lib/types/fastapierror.svelte';

	let { data }: PageProps = $props();

	// Search state
	let searchQuery = $state('');

	// Derive include deleted from data
	const includeDeleted = $derived(data.includeDeleted);

	// Handle include deleted toggle
	function toggleIncludeDeleted() {
		const url = new URL(window.location.href);
		if (!includeDeleted) {
			url.searchParams.set('include-deleted', 'true');
		} else {
			url.searchParams.delete('include-deleted');
		}
		goto(url.toString());
	}

	// Transform orders (user data already included from API)
	const allOrders = $derived(data.order_data.map((orderData: OrderData) => new Order(orderData)));

	// Filtered orders based on search
	const filteredOrders = $derived(
		allOrders.filter((order) => {
			if (!searchQuery) return true;
			if (!order.user) return false;
			return User.matchesSearch(order.user, searchQuery);
		})
	);

	function handleDelete(orderId: number) {
		if (!confirm('Are you sure you want to delete this order?')) {
			return false;
		}
		return true;
	}
</script>

{#snippet deleteButton(orderId: number)}
	<form
		method="POST"
		action="?/delete"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'failure') {
					let errorMessage = 'Failed to delete order';
					const errorString = result.data?.error;
					if (errorString && typeof errorString === 'string') {
						try {
							const errorData: FastAPIError = JSON.parse(errorString);
							errorMessage = errorData.detail || errorMessage;
						} catch {
							errorMessage = errorString;
						}
					}
					toastStore.error(errorMessage);
				} else if (result.type === 'error') {
					toastStore.error('An unexpected error occurred while deleting the order');
				} else if (result.type === 'success') {
					// Show success toast
					toastStore.success(`Order #${orderId} deleted successfully`);
					// Reload the orders data
					await invalidateAll();
				}
			};
		}}
	>
		<input type="hidden" name="orderId" value={orderId} />
		<button
			type="submit"
			onclick={() => !handleDelete(orderId)}
			class="mt-2 rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
			aria-label="Delete order"
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
{/snippet}

<div class="flex min-w-xs flex-col gap-4">
	<!-- Search Input -->
	<input
		type="text"
		bind:value={searchQuery}
		placeholder="Search by username, name, or email..."
		class="rounded-lg border px-4 py-2 text-gray-700"
	/>

	<!-- Include Deleted Toggle -->
	<label class="flex cursor-pointer items-center gap-2">
		<input
			type="checkbox"
			checked={includeDeleted}
			onclick={toggleIncludeDeleted}
			class="size-4 cursor-pointer rounded border-gray-300"
		/>
		<span class="text-sm">Include deleted orders</span>
	</label>

	<!-- Orders List -->
	{#each filteredOrders as order}
		<OrderDisplay {order} showUser={true} {deleteButton} />
	{/each}

	{#if filteredOrders.length === 0}
		<p class="text-center text-gray-500">
			{searchQuery ? 'No orders found matching your search' : 'No orders yet'}
		</p>
	{/if}
</div>
