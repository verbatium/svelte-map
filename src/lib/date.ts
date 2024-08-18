const timeZone = 'Europe/Tallinn';

export function today() {
	const dateParts = new Date()
		.toLocaleString('en', { timeZoneName: 'short', timeZone: timeZone })
		.split(' ');
	dateParts.splice(1, 2);
	return new Date(dateParts.join(' '));
}


export function endOfTheDay(date: Date) {
	const dateParts = date.toLocaleString('en', { timeZoneName: 'short', timeZone: timeZone }).split(' ');
  dateParts[1] = '11:59:59.999'
  dateParts[2] = 'PM'
	
	return new Date(dateParts.join(' '));
}