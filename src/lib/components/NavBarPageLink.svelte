<script lang="ts">
	import { page } from '$app/state';
	import { capitalizeFirstLetter } from '$lib/utils/capitalize';
	let { name, route = undefined } = $props();
</script>

<a
	href="/{route ?? name}"
	aria-current={page.url.pathname === '/' + name ? 'page' : undefined}
	class="rounded-full px-4 py-2 font-semibold hover:text-blue-500 aria-[current=page]:border-2"
	>{capitalizeFirstLetter(name)}</a
>
