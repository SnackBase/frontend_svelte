export class Product {
	id: number;
	name: string;
	price: number;
	type: string;
	currency: string;
	currencySymbol: string;
	image: string;
	count = $state(0);

	constructor(data: {
		id: number;
		name: string;
		price: number;
		type: string;
		currency: string;
		currencySymbol: string;
		image: string;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.price = data.price;
		this.type = data.type;
		this.currency = data.currency;
		this.currencySymbol = data.currencySymbol;
		this.image = data.image;
	}

	increment(): void {
		this.count++;
	}

	decrement(): void {
		if (this.count > 0) {
			this.count--;
		}
	}
}
