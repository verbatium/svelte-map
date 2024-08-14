import type { Handle } from '@sveltejs/kit';
import type { User } from './app';
import { authenticationCookieName, userInfo } from '$lib/server/oauth';
import { jwtPayload } from '$lib/jwt';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(authenticationCookieName) as string;
	console.log('cookies', event.cookies.getAll());
	if (token) {
		//verify(token, keys)
		console.log('hooks: ', token);
		
		let jwtPayload1 = await jwtPayload(token);
		if (event.locals?.user?.id === jwtPayload1.sub) {
			return resolve(event);
		} else {
			const info = await userInfo(token);
			event.locals.user = {
				id: jwtPayload1.sub,
				fullName: info.full_name,
				profileImageUrl: info.profile_image_url,
				vault_uuid: info.vault_uuid,
				email: info.email
			} as User;
		}
	} else {
		console.log('hooks: ', 'no token');
		if (event.locals) delete event.locals.user;
	}
	return resolve(event);
};
