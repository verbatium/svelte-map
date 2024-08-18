//https://dashboard.elering.ee/swagger-ui.html

import { endOfTheDay } from '$lib/date';

export async function energyPrice(startDateTime: Date) {
	const url = new URL('https://estfeed.elering.ee/api/public/v1/energy-price/electricity');
	const endDateTime = endOfTheDay(startDateTime);
	url.searchParams.set('startDateTime', startDateTime.toISOString());
	url.searchParams.set('endDateTime', endDateTime.toISOString());
	url.searchParams.set('resolution', 'one_hour');

	let response = await fetch(url);
	let body = await response.text();
	if (response.ok && body) {
		console.log('body is: ', body);
		return JSON.parse(body, reviver);
	}
	return []
}

export async function hourlyPrice(startDateTime: Date) {
	return ((await energyPrice(startDateTime)) as unknown as MarketPrice[])
		.sort((a, b) => a.fromDateTime.getTime() - b.fromDateTime.getTime())
		.map((p) => p.centsPerKwh);
}

export async function gasPrice() {
	const url = new URL('https://estfeed.elering.ee/api/public/v1/energy-price/electricity');
	url.searchParams.set('startDateTime', '2024-07-31T21:00:00.000Z');
	url.searchParams.set('endDateTime', '2024-08-31T20:59:59.999Z');
	url.searchParams.set('resolution', 'one_day');

	let response = await fetch(url);
	let body = await response.text();
	return JSON.parse(body, reviver);
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|(\+\d{2}:\d{2}))?$/;

function reviver(key: any, value: any) {
	if (typeof value === 'string' && dateFormat.test(value)) {
		return new Date(value);
	}

	return value;
}

export interface MarketPrice {
	centsPerKwh: number;
	centsPerKwhWithVat: number;
	eurPerMwh: number;
	eurPerMwhWithVat: number;
	fromDateTime: Date;
	toDateTime: Date;
}
