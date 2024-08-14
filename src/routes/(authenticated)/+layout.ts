import { session } from '$lib/stores/session';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { LayoutServerLoadEvent } from './$types';

export async function load(event: LayoutServerLoadEvent) {
	const parent_data = await event.parent();
	const locals_user = event.locals?.user;
	const session_user = get(session)?.user;
	const user = parent_data.user;
	if (!user) {
		session.update((s) => ({ ...s, redirectUrl: event.url.href}));
		throw redirect(301, '/auth/login');
	}
	return { user };
}
