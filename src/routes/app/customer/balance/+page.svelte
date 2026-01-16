<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import PaymentDisplay from '$lib/components/PaymentDisplay.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import { INPUT_BASE_CLASS } from '$lib/constants/product';
	import { toastStore } from '$lib/stores/toast.svelte';
	import type { FastAPIError } from '$lib/types/fastapierror.svelte';
	import { Payment, type PaymentData } from '$lib/types/payment.svelte';
	import type { PageProps } from './$types';
	import { slide } from 'svelte/transition';

	let { data }: PageProps = $props();
	let payments = $derived(data.payments_data.map((p: PaymentData) => new Payment(p)));

	let showForm = $state(false);

	function toggleForm() {
		showForm = !showForm;
	}

	function closeForm() {
		showForm = false;
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Toggle Button -->
	<button
		onclick={toggleForm}
		class="flex w-full items-center justify-center gap-2 rounded-2xl border py-3 transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
	>
		<span class="text-xl transition-transform duration-300 {showForm ? 'rotate-45' : ''}">+</span>
		<span class="relative w-28 overflow-hidden">
			<span
				class="absolute inset-0 flex items-center justify-center transition-transform duration-300 {showForm
					? '-translate-x-full'
					: 'translate-x-0'}"
			>
				New Payment
			</span>
			<span
				class="absolute inset-0 flex items-center justify-center transition-transform duration-300 {showForm
					? 'translate-x-0'
					: 'translate-x-full'}"
			>
				Cancel
			</span>
			<span class="invisible">New Payment</span>
		</span>
	</button>

	<!-- Form Container with slide animation -->
	{#if showForm}
		<div transition:slide={{ duration: 300 }}>
			<form
				method="POST"
				class="flex flex-col gap-2 pb-4"
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
							toastStore.success(`Deposit made successfully`);
							await invalidateAll();
							closeForm();
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
		</div>
	{/if}

	<!-- Payments List -->
	<div class="flex flex-col gap-4">
		<div class="font-medium">Payments</div>
		{#each payments as payment}
			<PaymentDisplay {payment} />
		{/each}
	</div>
</div>
