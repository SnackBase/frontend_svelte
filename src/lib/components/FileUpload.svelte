<script lang="ts">
	import { INPUT_BASE_CLASS } from '$lib/constants/product';

	interface Props {
		id: string;
		name: string;
		label: string;
		accept: string;
		required?: boolean;
	}

	let { id, name, label, accept, required = false }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="block">{label}</label>
	<input {id} {name} type="file" {accept} {required} class={INPUT_BASE_CLASS} />
</div>
