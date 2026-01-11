<script lang="ts">
	import { DateFormatter } from '$lib/utils/DateFormatter';
	import { Order, OrderItem } from '$lib/types/order.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Transform raw order data into Order class instances
	const orders = $derived(data.order_data.map((order: any) => new Order(order)));
</script>

{#snippet order_item_display(item: OrderItem)}
	<div class="flex flex-row gap-2 rounded-2xl border-2 p-2">
		<img
			src={item.getProxiedImageUrl()}
			alt={item.name}
			class="size-18 rounded-2xl bg-white object-cover"
		/>

		<div class="flex w-full flex-col">
			<div class="font-semibold">{item.name}</div>
			<div class="flex flex-col items-end">
				<div class="text-sm text-gray-500">
					{item.count} × {item.getFormattedPrice()}
				</div>
				<div class="font-bold">
					{item.getFormattedOrderItemTotal()}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet order_display(order: Order)}
	<div class="flex flex-col gap-4 rounded-4xl border-2 p-4">
		<!-- Order Header -->
		<div class="flex flex-row justify-between">
			<div class="flex flex-col gap-1">
				<div class="text-sm text-gray-500">Order #{order.id}</div>
				<div class="text-sm">{DateFormatter(order.createdAt)}</div>
			</div>
			<div class="flex flex-col items-end gap-1">
				<div class="text-sm text-gray-500">Total</div>
				<div class="text-xl font-bold">{order.getFormattedTotal()}</div>
			</div>
		</div>

		<!-- Separator -->
		<!-- <div class="h-px bg-gray-300 dark:bg-gray-700"></div> -->

		<!-- Order Items -->
		<div class="flex flex-col gap-3">
			{#each order.items as item}
				{@render order_item_display(item)}
			{/each}
		</div>
	</div>
{/snippet}

<div class="flex min-w-xs flex-col gap-4 sm:min-w-xl">
	{#each orders as order}
		{@render order_display(order)}
	{/each}
</div>
