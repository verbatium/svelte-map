import type {ActionReturn} from 'svelte/action'

type UseParam = { scaleFactor: number, inverseMatrix: DOMMatrix }

interface Attributes {
  'on:cursormoved'?: (e: CustomEvent<DOMPoint>) => void;
  'on:viewboxchanged'?: (e: CustomEvent<DOMRect>) => void;
}

export function panZoom(node: SVGSVGElement, param: UseParam): ActionReturn<UseParam, Attributes> {
  let scaleFactor = param?.scaleFactor ?? 1.025
  let inverseMatrix = param?.inverseMatrix
  const viewBox: DOMRect = node.viewBox.baseVal
  let pointerOrigin: DOMPoint = node.createSVGPoint()
  let isPointerDown: boolean = false
  const evCache: PointerEvent[] = []
  let prevDiff = 0
  
  function getRealPointFromEvent(event: PointerEvent): DOMPoint {
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(node.getScreenCTM()?.inverse())
  }
  
  function onPointerMove(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const pointerPosition = getRealPointFromEvent(event)
    // Find this event in the cache and update its record with this event
    evCache[eventIndex(event)] = event
    // If two pointers are down, check for pinch gestures
    if (evCache.length === 2) {
      // Calculate the distance between the two pointers
      const curDiff = Math.abs(evCache[0]?.clientX - evCache[1].clientX)
      if (prevDiff) {
          onZoom(new DOMPoint(evCache[0].clientX, evCache[0].clientY), prevDiff-curDiff)
      }
      prevDiff = curDiff
    } else if (isPointerDown) {
      viewBox.x -= (pointerPosition.x - pointerOrigin.x)
      viewBox.y -= (pointerPosition.y - pointerOrigin.y)
      node.dispatchEvent(new CustomEvent<DOMRect>('viewboxchanged', {detail: transformRect(inverseMatrix, viewBox)}))
    } else {
      node.dispatchEvent(new CustomEvent<DOMPoint>('cursormoved', {detail: pointerPosition.matrixTransform(inverseMatrix)}))
    }
  }
  
  function eventIndex(ev: PointerEvent) {
    return evCache.findIndex((cachedEv) => cachedEv.pointerId === ev.pointerId)
  }
  
  function removeEvent(event: PointerEvent) {
    const index = eventIndex(event)
    evCache.splice(index, 1)
  }
  
  function transformRect(m: DOMMatrix, r: DOMRect): DOMRect {
    const matrix = m.translate(0, r.height)
    const p = new DOMPoint(r.x, r.y).matrixTransform(matrix)
    const p2 = new DOMPoint(r.x + r.width, r.y + r.height).matrixTransform(matrix)
    return new DOMRect(p.x, p.y, p2.x - p.x, p.y - p2.y)
  }
  
  function onPointerDown(event: PointerEvent) {
    event.preventDefault()
    evCache.push(event)
    isPointerDown = true
    pointerOrigin = getRealPointFromEvent(event)
    node.dispatchEvent(new CustomEvent<DOMPoint>('cursormoved', {detail: pointerOrigin.matrixTransform(inverseMatrix)}))
  }
  
  function onPointerUp(ev: PointerEvent) {
    isPointerDown = false
    ev.preventDefault()
    removeEvent(ev)
    if (evCache.length < 2) {
      prevDiff = 0
    }
  }
  
  function onWheel(event: WheelEvent) {
    event.preventDefault()
    node.dispatchEvent(new CustomEvent<DOMRect>('viewboxchanged', {detail: transformRect(inverseMatrix, viewBox)}))
    onZoom(new DOMPoint(event.clientX, event.clientY), event.deltaY)
  }
  
  function onZoom(start: DOMPoint, delta: number) {
    const scaleDelta = delta < 0 ? 1 / scaleFactor : scaleFactor
    const startPoint = start.matrixTransform(node.getScreenCTM()?.inverse())
    viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1)
    viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1)
    viewBox.width *= scaleDelta
    viewBox.height *= scaleDelta
    node.dispatchEvent(new CustomEvent<DOMRect>('viewboxchanged', {detail: transformRect(inverseMatrix, viewBox)}))
  }
  
  const options  = false//: AddEventListenerOptions = {passive: false, capture: true}
  node.addEventListener('pointerdown', onPointerDown, options)
  node.addEventListener('pointermove', onPointerMove, options)
  node.addEventListener('pointerup', onPointerUp, options)
  node.addEventListener('pointercancel', onPointerUp, options)
  node.addEventListener('pointerleave', onPointerUp, options)
  node.addEventListener('wheel', onWheel, options)
  
  
  return {
    update(param: UseParam) {
      scaleFactor = param?.scaleFactor ?? 1.025
      inverseMatrix = param?.inverseMatrix
    },
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown, options)
      node.removeEventListener('pointermove', onPointerMove, options)
      node.removeEventListener('pointerup', onPointerUp, options)
      node.removeEventListener('pointercancel', onPointerUp, options)
      node.removeEventListener('pointerleave', onPointerUp, options)
      node.removeEventListener('wheel', onWheel, options)
    },
  }
}
