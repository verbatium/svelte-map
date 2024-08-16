import type { Handle } from '@sveltejs/kit';
import type { User } from './app';
import { authenticationCookieName } from '$lib/server/oauth';
import { jwtPayload } from '$lib/jwt';
import { me } from '$lib/tesla/api';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(authenticationCookieName) as string;
	if (token) {
		//verify(token, keys)
		let jwtPayload1 = await jwtPayload(token);
		if (jwtPayload1.exp < Date.now() / 1000) {
			event.cookies.delete(authenticationCookieName, { path: '/' });
			if (event.locals) delete event.locals.user;
		} else if (event.locals?.user?.id === jwtPayload1.sub) {
			return resolve(event);
		} else {
			const info = await me(token);
			event.locals.user = {
				id: jwtPayload1.sub,
				fullName: info.full_name,
				token: token,
				profileImageUrl: info.profile_image_url,
				vault_uuid: info.vault_uuid,
				email: info.email
			} as User;
		}
	} else {
		if (event.locals) delete event.locals.user;
	}
	return resolve(event);
};
