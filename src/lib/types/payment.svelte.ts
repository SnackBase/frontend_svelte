import { formatCurrency, type CurrencyConfig } from '$lib/constants/product';
import type { UserData } from './userData.svelte';

export interface PaymentData {
	id: number;
	amount: number;
	createdAt: Date | string;
	processedAt: Date | string | null;
	confirmed: boolean | null;
	note: string | null;
	user: UserData;
}

export class Payment {
	id: number;
	amount: number;
	createdAt: Date | string;
	processedAt: Date | string | null;
	confirmed: boolean | null;
	note: string | null;
	user: UserData;

	constructor(data: PaymentData) {
		this.id = data.id;
		this.amount = data.amount;
		this.createdAt = typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
		this.processedAt = data.processedAt
			? typeof data.processedAt === 'string'
				? new Date(data.processedAt)
				: data.processedAt
			: null;
		this.confirmed = data.confirmed;
		this.note = data.note;
		this.user = data.user;
	}

	// Get user's full name (for admin view)
	getUserFullName(): string {
		if (!this.user) return 'Unknown User';
		return `${this.user.firstName} ${this.user.lastName}`;
	}

	// Format total per order with currency (uses first item's currency)
	getFormatetdAmount(): string {
		return formatCurrency(this.amount, this.getCurrencyConfig());
	}

	// TODO: remove this and replace by api call/global setting
	getCurrencyConfig(): CurrencyConfig {
		return { code: 'EUR', locale: 'de-DE', name: 'Euro', symbol: '€' };
	}
}
