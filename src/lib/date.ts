const timeZone = 'Europe/Tallinn';

export function today() {
	return startOfTheDay(new Date());
}

export function startOfTheDay(date: Date) {
	return atTime(date, '00:00:00.000 AM');
}

export function endOfTheDay(date: Date) {
	return atTime(date, '11:59:59.999 PM');
}

export function nextDay(date: Date) {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() + 1);
	return newDate;
}

export function prviousDay(date: Date) {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() - 1);
	return newDate;
}

export function atTime(date: Date, time: string) {
	const dateParts = date
		.toLocaleString('en', { timeZoneName: 'short', timeZone: timeZone })
		.split(' ');
	const timeParts = time.split(' ');
	dateParts[1] = timeParts[0];
	dateParts[2] = timeParts[1];
	
	return new Date(dateParts.join(' '));
}

export function isoDate(date: Date) {
	return new Intl.DateTimeFormat('en-ca', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hourCycle: 'h24'
	}).format(date);
}
