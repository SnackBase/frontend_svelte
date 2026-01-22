<script lang="ts">
	import { DateFormatter } from '$lib/utils/DateFormatter';
	import type { Order, OrderItem } from '$lib/types/order.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		order: Order;
		showUser?: boolean;
		deleteButton?: Snippet<[number]>;
	}

	let { order, showUser = false, deleteButton }: Props = $props();
</script>

{#snippet order_item_display(item: OrderItem)}
	<div class="flex flex-row gap-2 rounded-2xl border p-2 {order.isDeleted ? 'opacity-50' : ''}">
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

<div class="flex flex-col gap-4 rounded-2xl border p-4 {order.isDeleted ? 'opacity-50' : ''}">
	<!-- Order Header -->
	<div class="flex flex-row justify-between">
		<div class="flex flex-col gap-1">
			{#if showUser && order.user}
				<div class="font-semibold">{order.getUserFullName()}</div>
			{/if}
			<div class="text-sm text-gray-500">Order #{order.id}</div>
			<div class="text-sm">{DateFormatter(order.createdAt)}</div>
			{#if order.isDeleted && order.deletedAt}
				<div
					class="mt-1 w-fit rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"
				>
					Deleted {DateFormatter(order.deletedAt)}
				</div>
			{/if}
		</div>
		<div class="flex flex-col items-end gap-1">
			<div class="text-sm text-gray-500">Total</div>
			<div class="text-xl font-bold">{order.getFormattedTotal()}</div>
			{#if deleteButton && !order.isDeleted}
				{@render deleteButton(order.id)}
			{/if}
		</div>
	</div>

	<!-- Order Items -->
	<div class="flex flex-col gap-3">
		{#each order.items as item}
			{@render order_item_display(item)}
		{/each}
	</div>
</div>
