import { error, json, type ServerLoadEvent } from '@sveltejs/kit';
import { authenticationCookieName } from '$lib/server/oauth';
import { region } from '$lib/tesla/api';

export async function GET(a: ServerLoadEvent) {
	let token = a.cookies.get(authenticationCookieName);
	if (!token) {
		error(401, 'access denied');
	}
	let userDetails = await region(token);

	return json(userDetails);
}
