<script lang="ts">
	import { INPUT_BASE_CLASS, INPUT_NUMBER_CLASS } from '$lib/constants/product';
	import { configStore } from '$lib/stores/configStore.svelte';

	interface Props {
		id: string;
		name: string;
		label: string;
		required?: boolean;
		value?: number;
	}

	let { id, name, label, required = false, value = $bindable(0) }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="block">{label}</label>
	<div class="flex flex-row items-center">
		<input
			{id}
			{name}
			type="text"
			inputmode="decimal"
			placeholder="0.00"
			{required}
			class="{INPUT_NUMBER_CLASS} w-full"
		/>
		<!-- TODO: remove space to the right -->
		<span class="relative right-6 text-gray-500">
			{configStore.currency.symbol}
		</span>
	</div>
</div>
