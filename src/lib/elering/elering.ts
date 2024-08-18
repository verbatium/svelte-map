//https://dashboard.elering.ee/swagger-ui.html

export async function energyPrice(startDateTime: Date) {
	const url = new URL('https://estfeed.elering.ee/api/public/v1/energy-price/electricity');
	console.log(startDateTime.toISOString());
	const endDateTime = new Date(startDateTime);
	endDateTime.setHours(23, 59, 59, 999);
	url.searchParams.set('startDateTime', startDateTime.toISOString());
	url.searchParams.set('endDateTime', endDateTime.toISOString());
	url.searchParams.set('resolution', 'one_hour');

	let response = await fetch(url);
	let body = await response.text();
	return JSON.parse(body, reviver);
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

const resp = [
	{
		centsPerKwh: 10.861,
		centsPerKwhWithVat: 13.25042,
		eurPerMwh: 108.61,
		eurPerMwhWithVat: 132.5042,
		fromDateTime: '2024-08-18T00:00:00+03:00',
		toDateTime: '2024-08-18T00:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 11.469,
		centsPerKwhWithVat: 13.99218,
		eurPerMwh: 114.69,
		eurPerMwhWithVat: 139.9218,
		fromDateTime: '2024-08-18T01:00:00+03:00',
		toDateTime: '2024-08-18T01:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 11.241,
		centsPerKwhWithVat: 13.71402,
		eurPerMwh: 112.41,
		eurPerMwhWithVat: 137.1402,
		fromDateTime: '2024-08-18T02:00:00+03:00',
		toDateTime: '2024-08-18T02:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 10.578,
		centsPerKwhWithVat: 12.90516,
		eurPerMwh: 105.78,
		eurPerMwhWithVat: 129.0516,
		fromDateTime: '2024-08-18T03:00:00+03:00',
		toDateTime: '2024-08-18T03:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 10.576,
		centsPerKwhWithVat: 12.90272,
		eurPerMwh: 105.76,
		eurPerMwhWithVat: 129.0272,
		fromDateTime: '2024-08-18T04:00:00+03:00',
		toDateTime: '2024-08-18T04:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 10.428,
		centsPerKwhWithVat: 12.72216,
		eurPerMwh: 104.28,
		eurPerMwhWithVat: 127.2216,
		fromDateTime: '2024-08-18T05:00:00+03:00',
		toDateTime: '2024-08-18T05:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 10.442,
		centsPerKwhWithVat: 12.73924,
		eurPerMwh: 104.42,
		eurPerMwhWithVat: 127.3924,
		fromDateTime: '2024-08-18T06:00:00+03:00',
		toDateTime: '2024-08-18T06:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 9.881,
		centsPerKwhWithVat: 12.05482,
		eurPerMwh: 98.81,
		eurPerMwhWithVat: 120.5482,
		fromDateTime: '2024-08-18T07:00:00+03:00',
		toDateTime: '2024-08-18T07:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 9.44,
		centsPerKwhWithVat: 11.5168,
		eurPerMwh: 94.4,
		eurPerMwhWithVat: 115.168,
		fromDateTime: '2024-08-18T08:00:00+03:00',
		toDateTime: '2024-08-18T08:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 8.765,
		centsPerKwhWithVat: 10.6933,
		eurPerMwh: 87.65,
		eurPerMwhWithVat: 106.933,
		fromDateTime: '2024-08-18T09:00:00+03:00',
		toDateTime: '2024-08-18T09:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 8.152,
		centsPerKwhWithVat: 9.94544,
		eurPerMwh: 81.52,
		eurPerMwhWithVat: 99.4544,
		fromDateTime: '2024-08-18T10:00:00+03:00',
		toDateTime: '2024-08-18T10:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 6.971,
		centsPerKwhWithVat: 8.50462,
		eurPerMwh: 69.71,
		eurPerMwhWithVat: 85.0462,
		fromDateTime: '2024-08-18T11:00:00+03:00',
		toDateTime: '2024-08-18T11:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 6.904,
		centsPerKwhWithVat: 8.42288,
		eurPerMwh: 69.04,
		eurPerMwhWithVat: 84.2288,
		fromDateTime: '2024-08-18T12:00:00+03:00',
		toDateTime: '2024-08-18T12:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 6.401,
		centsPerKwhWithVat: 7.80922,
		eurPerMwh: 64.01,
		eurPerMwhWithVat: 78.0922,
		fromDateTime: '2024-08-18T13:00:00+03:00',
		toDateTime: '2024-08-18T13:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 3.26,
		centsPerKwhWithVat: 3.9772,
		eurPerMwh: 32.6,
		eurPerMwhWithVat: 39.772,
		fromDateTime: '2024-08-18T14:00:00+03:00',
		toDateTime: '2024-08-18T14:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 1.686,
		centsPerKwhWithVat: 2.05692,
		eurPerMwh: 16.86,
		eurPerMwhWithVat: 20.5692,
		fromDateTime: '2024-08-18T15:00:00+03:00',
		toDateTime: '2024-08-18T15:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 5.005,
		centsPerKwhWithVat: 6.1061,
		eurPerMwh: 50.05,
		eurPerMwhWithVat: 61.061,
		fromDateTime: '2024-08-18T16:00:00+03:00',
		toDateTime: '2024-08-18T16:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 9.4,
		centsPerKwhWithVat: 11.468,
		eurPerMwh: 94,
		eurPerMwhWithVat: 114.68,
		fromDateTime: '2024-08-18T17:00:00+03:00',
		toDateTime: '2024-08-18T17:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 10.254,
		centsPerKwhWithVat: 12.50988,
		eurPerMwh: 102.54,
		eurPerMwhWithVat: 125.0988,
		fromDateTime: '2024-08-18T18:00:00+03:00',
		toDateTime: '2024-08-18T18:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 11.393,
		centsPerKwhWithVat: 13.89946,
		eurPerMwh: 113.93,
		eurPerMwhWithVat: 138.9946,
		fromDateTime: '2024-08-18T19:00:00+03:00',
		toDateTime: '2024-08-18T19:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 16.236,
		centsPerKwhWithVat: 19.80792,
		eurPerMwh: 162.36,
		eurPerMwhWithVat: 198.0792,
		fromDateTime: '2024-08-18T20:00:00+03:00',
		toDateTime: '2024-08-18T20:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 14.654,
		centsPerKwhWithVat: 17.87788,
		eurPerMwh: 146.54,
		eurPerMwhWithVat: 178.7788,
		fromDateTime: '2024-08-18T21:00:00+03:00',
		toDateTime: '2024-08-18T21:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 12.288,
		centsPerKwhWithVat: 14.99136,
		eurPerMwh: 122.88,
		eurPerMwhWithVat: 149.9136,
		fromDateTime: '2024-08-18T22:00:00+03:00',
		toDateTime: '2024-08-18T22:59:59.999999999+03:00'
	},
	{
		centsPerKwh: 12.136,
		centsPerKwhWithVat: 14.80592,
		eurPerMwh: 121.36,
		eurPerMwhWithVat: 148.0592,
		fromDateTime: '2024-08-18T23:00:00+03:00',
		toDateTime: '2024-08-18T23:59:59.999999999+03:00'
	}
];
