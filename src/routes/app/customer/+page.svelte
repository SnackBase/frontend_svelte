<script lang="ts">
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex h-full flex-col items-center justify-center gap-4">
	<div class="text-shadow flex justify-center text-2xl font-bold shadow-white">
		Customer Dashboard
	</div>

	<div class="flex gap-4">
		<a href="/app/customer/shop"><ButtonStyle>Shop</ButtonStyle></a>
	</div>
</div>
