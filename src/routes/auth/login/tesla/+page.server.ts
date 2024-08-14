import { type Actions, redirect } from '@sveltejs/kit';
import { loginRedirectUrl } from '$lib/server/oauth';

export const actions = {
	default: async ({ url }) => {
		throw redirect(303, loginRedirectUrl(url.origin + '/auth/callback'));
	}
} satisfies Actions;
