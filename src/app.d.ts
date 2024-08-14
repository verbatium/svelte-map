// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
export interface User {
	id?: string;
	email: string;
	fullName?: string,
	profileImageUrl?: string,
	[key: string]: any;
}

export {};
