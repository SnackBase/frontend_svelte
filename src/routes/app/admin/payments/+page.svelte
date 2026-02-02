<script lang="ts">
	import { Payment, type PaymentData } from '$lib/types/payment.svelte';
	import { User } from '$lib/types/userData.svelte';
	import PaymentDisplay from '$lib/components/PaymentDisplay.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import FilterButtons, { type FilterOption } from '$lib/components/FilterButtons.svelte';
	import Checkmark from '$lib/icons/checkmark.svelte';
	import Cross from '$lib/icons/cross.svelte';
	import { enhance } from '$app/forms';
	import { createFormEnhanceHandler } from '$lib/utils/formEnhanceHandler';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Search state
	let searchQuery = $state('');

	// Status filter state
	let statusFilter = $state('pending');

	const statusFilterOptions: FilterOption[] = [
		{ value: 'pending', label: 'Pending', activeClass: 'bg-yellow-100 text-yellow-700' },
		{ value: 'confirmed', label: 'Confirmed', activeClass: 'bg-green-100 text-green-700' },
		{ value: 'declined', label: 'Declined', activeClass: 'bg-red-100 text-red-700' },
		{ value: 'all', label: 'All', activeClass: 'bg-gray-200 dark:bg-gray-700' }
	];

	// Transform payments (user data already included from API)
	const allPayments = $derived(
		data.payments_data.map((paymentData: PaymentData) => new Payment(paymentData))
	);

	// Filtered payments based on search and status
	const filteredPayments = $derived(
		allPayments.filter((payment) => {
			// Status filter
			if (statusFilter === 'pending' && payment.processedAt !== null) return false;
			if (
				statusFilter === 'confirmed' &&
				!(payment.confirmed === true && payment.processedAt !== null)
			)
				return false;
			if (
				statusFilter === 'declined' &&
				!(payment.confirmed === false && payment.processedAt !== null)
			)
				return false;

			// Search filter
			if (!searchQuery) return true;
			if (!payment.user) return false;
			return User.matchesSearch(payment.user, searchQuery);
		})
	);
</script>

{#snippet actionButton(paymentId: number)}
	{@const payment = allPayments.find((p) => p.id === paymentId)}
	{#if payment && !payment.processedAt}
		<div class="mt-2 flex items-center gap-2">
			<form
				method="POST"
				action="?/decline"
				use:enhance={createFormEnhanceHandler({
					failureMessage: 'Failed to decline payment',
					errorMessage: 'An unexpected error occurred while declining the payment',
					successMessage: `Payment #${paymentId} declined`
				})}
			>
				<input type="hidden" name="paymentId" value={paymentId} />
				<button
					type="submit"
					class="flex size-8 items-center justify-center rounded-full border hover:border-red-500 hover:text-red-500"
					aria-label="Decline payment"
				>
					<Cross size={20} />
				</button>
			</form>
			<form
				method="POST"
				action="?/confirm"
				use:enhance={createFormEnhanceHandler({
					failureMessage: 'Failed to confirm payment',
					errorMessage: 'An unexpected error occurred while confirming the payment',
					successMessage: `Payment #${paymentId} confirmed successfully`
				})}
			>
				<input type="hidden" name="paymentId" value={paymentId} />
				<button
					type="submit"
					class="flex size-8 items-center justify-center rounded-full border hover:border-green-500 hover:text-green-500"
					aria-label="Confirm payment"
				>
					<Checkmark size={20} />
				</button>
			</form>
		</div>
	{/if}
{/snippet}

<div class="flex w-xs flex-col gap-4">
	<!-- Search Input -->
	<SearchInput bind:value={searchQuery} placeholder="Search by username, name, or email..." />

	<!-- Status Filter -->
	<FilterButtons options={statusFilterOptions} bind:selected={statusFilter} />

	<!-- Payments List -->
	{#each filteredPayments as payment}
		<PaymentDisplay {payment} showUser={true} {actionButton} />
	{/each}

	{#if filteredPayments.length === 0}
		<p class="text-center text-gray-500">
			{#if searchQuery}
				No payments found matching your search
			{:else if statusFilter === 'pending'}
				No pending payments
			{:else if statusFilter === 'confirmed'}
				No confirmed payments
			{:else if statusFilter === 'declined'}
				No declined payments
			{:else}
				No payments yet
			{/if}
		</p>
	{/if}
</div>
