import { error, json, type ServerLoadEvent } from '@sveltejs/kit';
import { authenticationCookieName } from '$lib/server/oauth';
import { httpGet } from '$lib/tesla/api';

export async function GET(a: ServerLoadEvent) {
	let token = a.cookies.get(authenticationCookieName);
	if (!token) {
		error(401, 'access denied');
	}
	const path = a.params['rest'];
	const q = a.url.search
	if (path) {
		console.log('call with  path', path + q);
		let data = await httpGet( '/' + path + q, token);
		return json(data);
	}
	return json({ error: 'Path missing' }, { status: 404 });
}
