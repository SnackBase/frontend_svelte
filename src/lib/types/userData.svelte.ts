export interface UserData {
	username: string;
	firstName: string;
	lastName: string;
	// Detail fields (only present in UserDetailView responses)
	id?: number;
	email?: string;
	emailVerified?: boolean;
	age_restrict?: boolean;
	allowed_overdraw?: number;
}

export class User {
	username: string;
	firstName: string;
	lastName: string;
	id?: number;
	email?: string;
	emailVerified?: boolean;
	age_restrict?: boolean;
	allowed_overdraw?: number;

	constructor(data: UserData) {
		this.username = data.username;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.id = data.id;
		this.email = data.email;
		this.emailVerified = data.emailVerified;
		this.age_restrict = data.age_restrict;
		this.allowed_overdraw = data.allowed_overdraw;
	}

	getFullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	hasDetailInfo(): boolean {
		return this.id !== undefined;
	}

	static matchesSearch(user: UserData, query: string): boolean {
		const q = query.toLowerCase();
		return (
			user.username.toLowerCase().includes(q) ||
			user.firstName.toLowerCase().includes(q) ||
			user.lastName.toLowerCase().includes(q) ||
			(user.email?.toLowerCase().includes(q) ?? false)
		);
	}
}
