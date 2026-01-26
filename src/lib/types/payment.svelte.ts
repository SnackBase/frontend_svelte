import { formatCurrency, type CurrencyConfig } from '$lib/constants/product';
import { configStore } from '$lib/stores/configStore.svelte';
import { User, type UserData } from './userData.svelte';
import { toDate, toDateOrNull } from '$lib/utils/dateUtils';

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
		this.createdAt = toDate(data.createdAt);
		this.processedAt = toDateOrNull(data.processedAt);
		this.confirmed = data.confirmed;
		this.note = data.note;
		this.user = data.user;
	}

	// Get user's full name (for admin view)
	getUserFullName(): string {
		if (!this.user) return 'Unknown User';
		return new User(this.user).getFullName();
	}

	// Format amount with currency
	getFormattedAmount(): string {
		return formatCurrency(this.amount, this.getCurrencyConfig());
	}

	// Get currency config from global store
	getCurrencyConfig(): CurrencyConfig {
		return configStore.currency;
	}
}
