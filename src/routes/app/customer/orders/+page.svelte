<script lang="ts">
	import { Order, type OrderData } from '$lib/types/order.svelte';
	import OrderDisplay from '$lib/components/OrderDisplay.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Transform raw order data into Order class instances
	const orders = $derived(data.order_data.map((order: OrderData) => new Order(order)));
</script>

<div class="flex min-w-xs flex-col gap-4">
	{#each orders as order}
		<OrderDisplay {order} showUser={false} />
	{/each}
</div>
