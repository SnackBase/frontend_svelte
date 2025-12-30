<script lang="ts">
	import TextButton from '$lib/components/TextButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import {
		formatCurrency,
		formatProductPrice,
		getCurrencyConfig,
		PRODUCT_TYPES
	} from '$lib/constants/product';
	import type { PageData } from './$types';
	import { capitalizeFirstLetter } from '$lib/utils/capitalize';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { Product } from '$lib/types/product.svelte';
	import type { CreateProductResponse } from './+page.server';
	import type { ProductData } from '$lib/types/productData.svelte';

	let { data, form }: { data: PageData; form: CreateProductResponse } = $props();

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

{#if form?.success}
	<div class="flex max-w-xl min-w-xs flex-col justify-start gap-4 sm:min-w-sm">
		<div class="flex">
			<ButtonStyle style="border-green-500 text-green-500 w-full justify-center"
				>Success!</ButtonStyle
			>
		</div>

		<!-- display new product that was created -->
		<div class="flex flex-col gap-2 rounded-3xl border-2 p-4 sm:flex-row">
			<img
				src={form?.product?.image}
				alt={form?.product?.name}
				class="h-32 max-w-64 rounded-2xl bg-white object-cover"
			/>
			<div class="flex flex-col">
				<div class="max-w-64 truncate text-xl font-bold sm:max-w-sm">{form?.product?.name}</div>
				<div>
					{form?.product ? formatProductPrice(form.product) : 'NaN'}
				</div>
			</div>
		</div>
		<div class="flex w-full">
			<a href="/app/admin/product/new" class="flex w-full"
				><ButtonStyle style="w-full justify-center">New Product</ButtonStyle></a
			>
		</div>
	</div>
{:else}
	<div class="flex flex-col gap-4">
		<div class="text-2xl font-bold">Create New Product</div>

		{#if form?.missing}
			<div class="rounded-3xl border-2 border-red-500 bg-red-50 p-4 dark:bg-red-950">
				<div class="font-bold text-red-700 dark:text-red-300">Error: Missing Required Field</div>
				<div class="text-red-600 dark:text-red-400">
					{#if form.details}
						{form.details}
					{:else}
						Please fill in all required fields and try again.
					{/if}
				</div>
			</div>
		{/if}

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
{/if}
