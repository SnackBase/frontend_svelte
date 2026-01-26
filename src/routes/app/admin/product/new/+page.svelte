<script lang="ts">
	import TextButton from '$lib/components/TextButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { PRODUCT_TYPES, ALLOWED_IMAGE_TYPES } from '$lib/constants/product';
	import type { PageData } from './$types';
	import { capitalizeFirstLetter } from '$lib/utils/capitalize';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import type { CreateProductResponse } from './+page.server';
	import { Product } from '$lib/types/product.svelte';
	import FormCheckbox from '$lib/components/FormCheckbox.svelte';
	import LockPerson from '$lib/icons/lock-person.svelte';

	let { data, form }: { data: PageData; form: CreateProductResponse } = $props();

	// Prepare options for the type dropdown
	const typeOptions = PRODUCT_TYPES.map((type) => ({
		value: type,
		label: capitalizeFirstLetter(type)
	}));

	let product_data = $derived(form?.product);
	let product = $derived(product_data ? new Product(product_data) : null);

	// Form state
	let productType = $state(''); //typeOptions[0].value
	let price = $state(0);
</script>

{#if form?.success}
	<div class="flex max-w-xl min-w-xs flex-col justify-start gap-4 sm:min-w-sm">
		<div class="flex">
			<ButtonStyle style="border-green-500 text-green-500 w-full justify-center"
				>Success!</ButtonStyle
			>
		</div>

		<!-- display new product that was created -->
		<div class="flex flex-col gap-2 rounded-3xl border p-4 sm:flex-row">
			<img
				src={product?.getProxiedImageUrl()}
				alt={product?.name}
				class="h-32 max-w-64 rounded-2xl bg-white object-contain"
			/>
			<div class="flex flex-col">
				<div class="max-w-64 truncate text-xl font-bold sm:max-w-sm">{product?.name}</div>
				<div class="flex flex-row items-center justify-between gap-2">
					{product ? product.getFormattedPrice() : 'NaN'}
					{#if product?.ageRestrict}
						<LockPerson />
					{/if}
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
			<div class="rounded-3xl border border-red-500 bg-red-50 p-4 dark:bg-red-950">
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

		<form method="POST" enctype="multipart/form-data" class="flex flex-col gap-4">
			<FormField id="name" name="name" label="Product Name" placeholder="Cola 0,33 L" required />

			<CurrencyInput
				id="price"
				name="price"
				label="Price"
				bind:value={price}
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

			<FileUpload
				id="image"
				name="image"
				label="Product Image"
				accept={ALLOWED_IMAGE_TYPES.join(',')}
				required
			/>

			<FormCheckbox id="ageRestrict" name="ageRestrict" label="Age Restriction" required={false} />

			<div class="flex justify-end"><TextButton>Create</TextButton></div>
		</form>
	</div>
{/if}
