import type { ProductData } from '$lib/types/productData.svelte';

// Product type enum
export enum ProductType {
	DRINK = 'drink',
	SNACK = 'snack'
}

// Get all product types as array
export const PRODUCT_TYPES = Object.values(ProductType);

// Shared form input styles
export const INPUT_BASE_CLASS =
	'rounded-full border-2 border-black dark:border-white dark:bg-gray-950 px-4 py-2 placeholder:text-gray-500';

export const INPUT_NUMBER_CLASS = `${INPUT_BASE_CLASS} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

// Currency configuration
export interface CurrencyConfig {
	name: string;
	symbol: string;
	code: string;
	locale: string;
}

// available currencies
export const CURRENCIES: CurrencyConfig[] = [
	{
		name: 'Euro',
		symbol: '€',
		code: 'EUR',
		locale: 'de-DE'
	},
	{
		name: 'US Dollar',
		symbol: '$',
		code: 'USD',
		locale: 'en-US'
	}
];

// Helper to get currency config by code
export const getCurrencyConfig = (code: string): CurrencyConfig => {
	return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
};

// Helper to format currency
export function formatCurrency(amount: number, currencyConfig: CurrencyConfig): string {
	return new Intl.NumberFormat(currencyConfig.locale, {
		style: 'currency',
		currency: currencyConfig.code
	}).format(amount);
}

// Helper function to format price of product
export const formatProductPrice = (product: ProductData) => {
	const currencyConfig = getCurrencyConfig(product.currency);
	return formatCurrency(product.price, currencyConfig);
};

// Helper to parse currency input (handles both . and , as decimal separator)
export function parseCurrencyInput(value: string): number {
	// Replace comma with dot for parsing
	const normalized = value.replace(',', '.');
	return parseFloat(normalized) || 0;
}
