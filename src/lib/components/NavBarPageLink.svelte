<script lang="ts">
	import { page } from '$app/state';
	import { capitalizeFirstLetter } from '$lib/utils/capitalize';

	interface Props {
		name: string;
		route?: string;
	}

	let { name, route }: Props = $props();

	const href = $derived(`/${route ?? name}`);
	const isActive = $derived(page.url.pathname === href);
</script>

<a
	{href}
	aria-current={isActive ? 'page' : undefined}
	class="whitespace-nowrap rounded-full px-4 py-2 font-semibold transition-colors hover:text-blue-500 {isActive
		? 'border-2'
		: 'border-2 border-transparent'}">{capitalizeFirstLetter(name)}</a
>
