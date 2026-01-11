<script lang="ts">
	import { INPUT_BASE_CLASS, INPUT_NUMBER_CLASS } from '$lib/constants/product';

	interface Props {
		id: string;
		name: string;
		label: string;
		required?: boolean;
	}

	let { id, name, label, required = false }: Props = $props();
</script>

<div class="flex flex-row items-center gap-1">
	<input
		{id}
		{name}
		{required}
		type="checkbox"
		class="h-4 w-4 rounded-full border border-black focus:ring-2 dark:border-white"
	/>
	<label for={id} class="block">{label}</label>
</div>
