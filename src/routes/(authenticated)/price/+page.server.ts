import { energyPrice, type MarketPrice } from '$lib/elering/elering';

export async function load() {
	const electricity = await energyPrice() as unknown as MarketPrice[]
	return { title: "prices" , electricity};
}