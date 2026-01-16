<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import TextButton from '$lib/components/TextButton.svelte';
	import { INPUT_BASE_CLASS } from '$lib/constants/product';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { FastAPIError } from '$lib/types/fastapierror.svelte';
	import { Payment, type PaymentData } from '$lib/types/payment.svelte';
	import { DateFormatter } from '$lib/utils/DateFormatter';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// TODO: move component into seperate file to be reused by admin page
	const showUser = false;
	let payments = $derived(data.payments_data.map((p: PaymentData) => new Payment(p)));
</script>

{#snippet displayPayment(payment: Payment)}
	<div
		class="flex flex-col gap-4 rounded-2xl border p-4 {payment.confirmed === false &&
		payment.processedAt !== null
			? 'border-red-400'
			: payment.confirmed === true && payment.processedAt !== null
				? 'border-gray-400'
				: payment.confirmed === false && payment.processedAt === null
					? 'border-yellow-400'
					: ''}"
	>
		<div class="flex flex-row justify-between">
			<div class="flex flex-col gap-1">
				{#if showUser && payment.user}
					<div class="font-semibold">{payment.getUserFullName()}</div>
					<div class="text-xs text-gray-500">{payment.user.email}</div>
				{/if}
				<div class="text-sm text-gray-500">Payment #{payment.id}</div>
				<div class="text-sm">{DateFormatter(payment.createdAt)}</div>
				<!-- TODO: change styling -->
				<div
					class="mt-1 w-fit rounded-full px-2 py-1 text-xs font-semibold
						{payment.confirmed === false && payment.processedAt !== null
						? 'bg-red-100 text-red-700'
						: payment.confirmed === true && payment.processedAt !== null
							? 'bg-green-100 text-green-700'
							: payment.confirmed === false && payment.processedAt === null
								? 'bg-yellow-100 text-yellow-700'
								: ''}"
				>
					{#if payment.processedAt}
						{payment.confirmed ? 'Confirmed' : 'Declined'} at {DateFormatter(payment.processedAt)}
					{:else}
						Pending
					{/if}
				</div>
			</div>
			<div class="flex flex-col items-end gap-1">
				<div class="text-sm text-gray-500">Amount</div>
				<div class="text-xl font-bold">{payment.getFormatetdAmount()}</div>
				<!-- TODO: add button to confirm or decline -->
				<!-- {#if deleteButton && !payment.isDeleted}
					{@render deleteButton(payment.id)}
				{/if} -->
			</div>
		</div>
	</div>
{/snippet}

<div class="flex flex-col gap-16">
	<form
		method="POST"
		class="flex flex-col gap-2"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'failure') {
					let errorMessage = 'Failed to make deposit';
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
					toastStore.error('An unexpected error occurred while making the deposit');
				} else if (result.type === 'success') {
					// Show success toast
					toastStore.success(`Deposit made successfully`);
					// Reload the orders data
					await invalidateAll();
				}
			};
		}}
	>
		<label class="flex flex-col gap-2">
			Amount
			<input name="amount" type="number" class={INPUT_BASE_CLASS} placeholder="0" />
		</label>
		<TextButton style="justify-center">Make Payment</TextButton>
	</form>
	<div class="flex flex-col gap-4">
		<div>Payments</div>
		{#each payments as payment}
			{@render displayPayment(payment)}
		{/each}
	</div>
</div>
