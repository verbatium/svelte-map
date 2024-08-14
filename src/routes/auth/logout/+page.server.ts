import { redirect } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types';
import { authenticationCookieName } from '$lib/server/oauth';
import { session } from '$lib/stores/session';

export async function load(event: PageServerLoadEvent) {
	// event.cookies.delete(authenticationCookieName, { path: '/' });
	event.cookies.set(authenticationCookieName, '', { path: '/', maxAge: 0 });
	session.update((s) => {
		s.user = undefined;
		return s;
	});
	if (event.locals) delete event.locals.user;
	//throw redirect(303, '/#');
}
