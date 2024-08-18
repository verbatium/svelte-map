import { hourlyPrice } from '$lib/elering/elering';
import { createClient } from '@vercel/kv';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';
import { today } from '$lib/date';

export async function load() {
	let updatedPageVisits: any;
	if (KV_REST_API_URL) {
		const kv = createClient({
			url: KV_REST_API_URL,
			token: KV_REST_API_TOKEN
		});
		const pageVisits = await kv.get<number>('pageVisits');
		await kv.set('pageVisits', (pageVisits || 0) + 1);
		updatedPageVisits = await kv.get('pageVisits');
	}

	let startDateTime = today();
	return {
		title: 'prices',
		electricity: await hourlyPrice(startDateTime),
		startDateTime,
		pageVisits: updatedPageVisits
	};
}
