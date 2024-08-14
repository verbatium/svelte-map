import { writable } from "svelte/store";
import type { User } from '../../app';

interface Session {
	user?: User | null;
	redirectUrl?: string | null;
}
export const session = writable<Session>(
	{
		user: null,
		redirectUrl: null
	}
);

session.subscribe((session) => console.log("session:", session));