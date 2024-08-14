import { authenticationCookieName, exchangeCodeForToken } from '$lib/server/oauth';
import { redirect } from '@sveltejs/kit';
import { jwtPayload } from '$lib/jwt';
import { dev } from '$app/environment';

export async function load({ url, cookies }) {
	const locale = url.searchParams.get('locale');
	const code = url.searchParams.get('code') || '';
	const state = url.searchParams.get('state') || '';
	const issuer = url.searchParams.get('issuer') || '';
	let redirectUrl = '/dashboard';

	const json = await exchangeCodeForToken(state, code, issuer, url.origin + url.pathname);

	let jwtPayload1 = await jwtPayload(json.access_token);
	cookies.set(authenticationCookieName, `${json.access_token}`, {
		httpOnly: true,
		path: '/',
		secure: !dev,
		sameSite: 'lax',
		maxAge: jwtPayload1.exp
	});
	
	throw redirect(302, redirectUrl);
}
