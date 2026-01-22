<script lang="ts">
	import { DateFormatter } from '$lib/utils/DateFormatter';
	import type { Payment } from '$lib/types/payment.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		payment: Payment;
		showUser?: boolean;
		actionButton?: Snippet<[number]>;
	}

	let { payment, showUser = false, actionButton }: Props = $props();

	function getBorderClass(): string {
		if (payment.confirmed === false && payment.processedAt !== null) {
			return 'border-red-400';
		}
		if (payment.confirmed === true && payment.processedAt !== null) {
			return 'border-white-400';
		}
		if (payment.confirmed === false && payment.processedAt === null) {
			return 'border-yellow-400';
		}
		return '';
	}

	function getStatusClass(): string {
		if (payment.confirmed === false && payment.processedAt !== null) {
			return 'bg-red-100 text-red-700';
		}
		if (payment.confirmed === true && payment.processedAt !== null) {
			return 'bg-green-100 text-green-700';
		}
		if (payment.confirmed === false && payment.processedAt === null) {
			return 'bg-yellow-100 text-yellow-700';
		}
		return '';
	}
</script>

<div class="flex flex-col gap-4 rounded-2xl border p-4 {getBorderClass()}">
	<div class="flex flex-row justify-between">
		<div class="flex flex-col gap-1">
			{#if showUser && payment.user}
				<div class="font-semibold">{payment.getUserFullName()}</div>
			{/if}
			<div class="text-sm text-gray-500">Payment #{payment.id}</div>
			<div class="text-sm">{DateFormatter(payment.createdAt)}</div>
			<div class="mt-1 w-fit rounded-full px-2 py-1 text-xs font-semibold {getStatusClass()}">
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
			{#if actionButton}
				{@render actionButton(payment.id)}
			{/if}
		</div>
	</div>
</div>
