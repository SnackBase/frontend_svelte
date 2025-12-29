<script lang="ts">
	import { CURRENCIES, INPUT_NUMBER_CLASS, INPUT_BASE_CLASS } from '$lib/constants/product';

	interface Props {
		id: string;
		name: string;
		label: string;
		required?: boolean;
		value?: number;
		currencyCode?: string;
	}

	let {
		id,
		name,
		label,
		required = false,
		value = $bindable(0),
		currencyCode = $bindable(CURRENCIES[0].code)
	}: Props = $props();

	// Get selected currency
	const selectedCurrency = $derived(
		CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0]
	);
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="block">{label}</label>
	<div class="flex flex-col gap-2 sm:flex-row">
		<div class="relative flex-1">
			<input
				{id}
				{name}
				type="text"
				inputmode="decimal"
				placeholder="0.00"
				{required}
				class={INPUT_NUMBER_CLASS}
			/>
			<span class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500">
				{selectedCurrency.symbol}
			</span>
		</div>

		{#if CURRENCIES.length > 1}
			<select bind:value={currencyCode} class="{INPUT_BASE_CLASS} w-32">
				{#each CURRENCIES as currency}
					<option value={currency.code}>{currency.code}</option>
				{/each}
			</select>
		{/if}
	</div>
	<input type="hidden" name="{name}_numeric" {value} />
	<input type="hidden" name="{name}_currency" value={selectedCurrency.name} />
	<input type="hidden" name="{name}_currencySymbol" value={selectedCurrency.symbol} />
	<input type="hidden" name="{name}_currencyCode" value={selectedCurrency.code} />
</div>
