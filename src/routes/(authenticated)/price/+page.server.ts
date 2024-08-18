import { energyPrice, type MarketPrice } from '$lib/elering/elering';
import { createClient } from '@vercel/kv';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private'

export async function load() {
	let updatedPageVisits: any;
	if (KV_REST_API_URL) {
		const kv = createClient({
			url: KV_REST_API_URL,
			token: KV_REST_API_TOKEN,
		})
		const pageVisits = await kv.get<number>('pageVisits')
		await kv.set('pageVisits', (pageVisits || 0) + 1)
		updatedPageVisits = await kv.get('pageVisits');
	}


	const electricity = await energyPrice() as unknown as MarketPrice[]
	return { title: "prices" , electricity, pageVisits: updatedPageVisits};
}