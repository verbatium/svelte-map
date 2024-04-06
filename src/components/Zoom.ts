import { touchPoints, twoTouchDistance } from '$lib/graphics';
import type { ActionReturn } from 'svelte/action';

export interface PanEventDetail {
	deltaY: number;
	deltaX: number;
}

interface Attributes {
	'on:zoomIn'?: (e: CustomEvent<void>) => void;
	'on:zoomOut'?: (e: CustomEvent<void>) => void;
	'on:pan'?: (e: CustomEvent<PanEventDetail>) => void;
}

export function zoom(node: SVGSVGElement): ActionReturn<{}, Attributes> {
	const handleWheel = (event: WheelEvent) => {
		const { deltaY, deltaX } = event;
		event.preventDefault();
		if (!Number.isInteger(deltaY) && deltaX == 0) {
			if (deltaY < 0) {
				node.dispatchEvent(new CustomEvent('zoomIn'));
			} else {
				node.dispatchEvent(new CustomEvent('zoomOut'));
			}
		} else {
			node.dispatchEvent(new CustomEvent<PanEventDetail>('pan', { detail: { deltaY, deltaX } }));
		}
	};
	let twoFingerDistance: number | undefined = undefined;
	let lastPosition: DOMPoint | undefined = undefined;
	const touchStart = (event: TouchEvent) => {
		event.preventDefault();
		event.stopPropagation();
		switch (event.touches.length) {
			case 1:
				lastPosition = touchPoints(event)[0];
				break;
			case 2:
				twoFingerDistance = twoTouchDistance(event);
		}
	};

	const touchend = () => {
		lastPosition = undefined;
		twoFingerDistance = undefined;
	};

	const touchMove = (event: TouchEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const currentDistance = twoTouchDistance(event);
		if (event.touches.length === 1) {
			const currentPosition = touchPoints(event)[0];
			const deltaX = (lastPosition ?? currentPosition).x - currentPosition.x;
			const deltaY = (lastPosition ?? currentPosition).y - currentPosition.y;
			node.dispatchEvent(new CustomEvent('pan', { detail: { deltaY, deltaX } }));
			lastPosition = currentPosition;
		} else {
			if (twoFingerDistance && currentDistance) {
				if (currentDistance - twoFingerDistance > 0) {
					node.dispatchEvent(new CustomEvent('zoomIn'));
				} else {
					node.dispatchEvent(new CustomEvent('zoomOut'));
				}
			}
		}
		twoFingerDistance = currentDistance;
	};

	const options: AddEventListenerOptions = { passive: false, capture: true };
	node.addEventListener('wheel', handleWheel, options);
	node.addEventListener('touchstart', touchStart, options);
	node.addEventListener('touchmove', touchMove, options);
	node.addEventListener('touchend', touchend, options);
	node.addEventListener('touchcancel', touchend, options);

	return {
		destroy() {
			node.removeEventListener('wheel', handleWheel, options);
			node.removeEventListener('touchstart', touchStart, options);
			node.removeEventListener('touchmove', touchMove, options);
			node.removeEventListener('touchend', touchend, options);
			node.removeEventListener('touchcancel', touchend, options);
		}
	};
}
