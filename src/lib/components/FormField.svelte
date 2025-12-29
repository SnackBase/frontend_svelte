<script lang="ts">
	import { INPUT_BASE_CLASS, INPUT_NUMBER_CLASS } from '$lib/constants/product';

	interface Props {
		id: string;
		name: string;
		label: string;
		type?: 'text' | 'number' | 'url' | 'email';
		placeholder?: string;
		required?: boolean;
		min?: number;
		step?: number;
		inputmode?: 'text' | 'numeric' | 'decimal';
	}

	let {
		id,
		name,
		label,
		type = 'text',
		placeholder = '',
		required = false,
		min,
		step,
		inputmode
	}: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="block">{label}</label>
	<input
		{id}
		{name}
		{type}
		{placeholder}
		{required}
		{min}
		{step}
		{inputmode}
		class={type === 'number' ? INPUT_NUMBER_CLASS : INPUT_BASE_CLASS}
	/>
</div>
