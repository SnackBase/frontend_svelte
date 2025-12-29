<script lang="ts">
	import TextButton from '$lib/components/TextButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import { PRODUCT_TYPES } from '$lib/constants/product';
	import type { PageProps } from './$types';
	import { capitalizeFirstLetter } from '$lib/utils/capitalize';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';

	let { data }: PageProps = $props();

	// Prepare options for the type dropdown
	const typeOptions = PRODUCT_TYPES.map((type) => ({
		value: type,
		label: capitalizeFirstLetter(type)
	}));

	// Form state
	let productType = $state(''); //typeOptions[0].value
	let price = $state(0);
	let currencyCode = $state('EUR');
</script>

<div class="flex flex-col gap-4">
	<div class="text-2xl font-bold">Create New Product</div>

	<form method="POST" class="flex flex-col gap-4">
		<FormField id="name" name="name" label="Product Name" placeholder="Cola 0,33 L" required />

		<CurrencyInput
			id="price"
			name="price"
			label="Price"
			bind:value={price}
			bind:currencyCode
			required
		/>

		<FormSelect
			id="type"
			name="type"
			label="Product Type"
			options={typeOptions}
			bind:value={productType}
			required
		/>

		<FormField
			id="image"
			name="image"
			label="Image URL"
			type="url"
			placeholder="http://website.abc/image.png"
			required
		/>

		<div class="flex justify-end"><TextButton>Create</TextButton></div>
	</form>
</div>
