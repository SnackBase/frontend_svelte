<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
	}

	let { value = $bindable(''), placeholder = 'Search...' }: Props = $props();
</script>

<input
	type="text"
	bind:value
	{placeholder}
	class="rounded-lg border px-4 py-2 text-gray-700"
/>
