import { hourlyPrice } from '$lib/elering/elering';
import { createClient } from '@vercel/kv';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';
import { isoDate, startOfTheDay, today } from '$lib/date';
import type { PageServerLoadEvent } from './$types';
import { redirect } from '@sveltejs/kit';

export async function load(event: PageServerLoadEvent) {
	if (!event.params.date) {
		throw redirect(303, `${event.url.pathname}/${isoDate(today())}`);
	}
	let updatedPageVisits: any;
	const kv = createClient({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });
	const pageVisits = await kv.get<number>('pageVisits');
	await kv.set('pageVisits', (pageVisits || 0) + 1);
	updatedPageVisits = await kv.get('pageVisits');

	let startDateTime = startOfTheDay(new Date(event.params.date));
	return {
		title: 'prices',
		prices: await hourlyPrice(startDateTime),
		startDateTime,
		pageVisits: updatedPageVisits
	};
}
