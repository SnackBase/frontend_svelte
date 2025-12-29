<script lang="ts">
	import { INPUT_BASE_CLASS } from '$lib/constants/product';

	interface Props {
		id: string;
		name: string;
		label: string;
		options: { value: string; label: string }[];
		required?: boolean;
		value?: string;
	}

	let { id, name, label, options, required = false, value = $bindable() }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="block">{label}</label>
	<select
		{id}
		{name}
		{required}
		bind:value
		class="{INPUT_BASE_CLASS} {!value ? 'text-gray-500' : 'text-black dark:text-white'}"
	>
		<option value="" disabled selected={!value}>
			Select {label.toLowerCase()}
		</option>
		{#each options as option}
			<option value={option.value} class="text-black dark:text-white">{option.label}</option>
		{/each}
	</select>
</div>
