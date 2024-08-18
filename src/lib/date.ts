const timeZone = 'Europe/Tallinn';

export function today() {
	return atTime(new Date(), '00:00:00.000 AM');
}


export function endOfTheDay(date: Date) {
	return atTime(date, '11:59:59.999 PM');
}
export function atTime(date: Date, time: string) {
	const dateParts = date.toLocaleString('en', { timeZoneName: 'short', timeZone: timeZone }).split(' ');
	const timeParts = time.split(' ')
	dateParts[1] = timeParts[0]
	dateParts[2] = timeParts[1]
	
	return new Date(dateParts.join(' '));
}