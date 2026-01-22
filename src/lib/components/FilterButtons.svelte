<script lang="ts">
	export interface FilterOption {
		value: string;
		label: string;
		activeClass: string;
	}

	interface Props {
		options: FilterOption[];
		selected?: string;
	}

	let { options, selected = $bindable(options[0]?.value ?? '') }: Props = $props();

	const baseClass = 'border hover:bg-gray-100 dark:hover:bg-gray-800';
</script>

<div class="flex gap-2">
	{#each options as option}
		<button
			onclick={() => (selected = option.value)}
			class="rounded-lg px-3 py-1.5 text-sm transition-colors {selected === option.value
				? option.activeClass
				: baseClass}"
		>
			{option.label}
		</button>
	{/each}
</div>
