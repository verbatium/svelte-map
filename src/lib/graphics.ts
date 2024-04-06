export function screenPoint(event: MouseEvent | TouchEvent): DOMPoint {
	if (event instanceof MouseEvent) {
		return new DOMPoint(event.clientX, event.clientY);
	} else if (event instanceof TouchEvent) {
		return new DOMPoint(event.touches[0].clientX, event.touches[0].clientY);
	} else {
		return new DOMPoint(0, 0);
	}
}

export function touchPoints(event: TouchEvent): DOMPoint[] {
	const result = [];
	for (let i = 0; i < event.touches.length; i++) {
		result[i] = new DOMPoint(event.touches[i].clientX, event.touches[i].clientY);
	}
	return result;
}

export function twoTouchDistance(event: TouchEvent) {
	if (event.touches.length == 2) {
		const dx = event.touches[0].clientX - event.touches[1].clientX;
		const dy = event.touches[0].clientY - event.touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}
	return undefined;
}
