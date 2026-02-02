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
	class="px-4 py-2 font-semibold whitespace-nowrap transition-colors hover:text-blue-500 {isActive
		? 'underline underline-offset-4 decoration-2'
		: ''}">{capitalizeFirstLetter(name)}</a
>
