export function mousePoint(event: MouseEvent) {
  return new DOMPoint(event.clientX, event.clientY)
}

export function touchPoint(event: TouchEvent) {
  return new DOMPoint(event.touches[0].clientX, event.touches[0].clientY)
}

export function twoTouchDistance(event: TouchEvent) {
  if (event.touches.length == 2) {
    const dx = event.touches[0].clientX - event.touches[1].clientX
    const dy = event.touches[0].clientY - event.touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }
  return undefined
}

export function limitPointToRange(point: DOMPoint, min: number, max: number) {
  return new DOMPoint(limitNumberToRange(point.x, min, max), limitNumberToRange(point.y, min, max))
}

export function floorPoint(point: DOMPoint): DOMPoint {
  return new DOMPoint(Math.floor(point.x - 0.5), Math.floor(point.y - 0.5))
}

export function ceilPoint(point: DOMPoint): DOMPoint {
  return new DOMPoint(Math.ceil(point.x + 0.5), Math.ceil(point.y + 0.5))
}

export function limitNumberToRange(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}
