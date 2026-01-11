import { Product } from './product.svelte';
import type { ProductData } from './productData.svelte';
import type { UserData } from './userData.svelte';
import { formatCurrency } from '$lib/constants/product';

// Interface for order item data from API
export interface OrderItemData extends ProductData {
	count: number;
	totalPerOrderItem: number;
}

// Class for order item that extends Product with order-specific properties
export class OrderItem extends Product {
	totalPerOrderItem: number;

	constructor(data: OrderItemData) {
		// Pass the product data to the parent Product class
		super(data);
		// Override count from ProductData with the order-specific count
		this.count = data.count;
		this.totalPerOrderItem = data.totalPerOrderItem;
	}

	// Format total per order item with currency
	getFormattedOrderItemTotal(): string {
		return formatCurrency(this.totalPerOrderItem, this.getCurrencyConfig());
	}
}

// Interface for order data from API
export interface OrderData {
	id: number;
	user: UserData;
	createdAt: string | Date;
	deletedAt: string | Date | null;
	totalPerOrder: number;
	items: OrderItemData[];
	isDeleted: boolean;
}

// Class for order with typed items
export class Order {
	id: number;
	user: UserData;
	createdAt: Date;
	deletedAt: Date | null;
	totalPerOrder: number;
	items: OrderItem[];
	isDeleted: boolean;

	constructor(data: OrderData) {
		this.id = data.id;
		this.user = data.user;
		this.createdAt = typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
		this.deletedAt = data.deletedAt
			? typeof data.deletedAt === 'string'
				? new Date(data.deletedAt)
				: data.deletedAt
			: null;
		this.totalPerOrder = data.totalPerOrder;
		this.items = data.items.map((item) => new OrderItem(item));
		this.isDeleted = data.isDeleted;
	}

	// Get user's full name (for admin view)
	getUserFullName(): string {
		if (!this.user) return 'Unknown User';
		return `${this.user.firstName} ${this.user.lastName}`;
	}

	// Format total per order with currency (uses first item's currency)
	getFormattedTotal(): string {
		if (this.items.length === 0) return '';
		return formatCurrency(this.totalPerOrder, this.items[0].getCurrencyConfig());
	}
}
