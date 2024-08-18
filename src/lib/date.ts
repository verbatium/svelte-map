const timeZone = 'Europe/Tallinn';

export function today() {
	const dateParts = new Date()
		.toLocaleString('en', { timeZoneName: 'short', timeZone: timeZone })
		.split(' ');
	dateParts.splice(1, 2);
	return new Date(dateParts.join(' '));
}