import type {ActionReturn} from 'svelte/action'

interface Attributes {
  'on:cursor'?: (e: CustomEvent<DOMPoint>) => void;
}

export function panZoom(node: SVGSVGElement): ActionReturn<{}, Attributes> {
  const viewBox: DOMRect = node.viewBox.baseVal
  const dY = -(viewBox.height + 2 * viewBox.y)
  const point: DOMPoint = node.createSVGPoint()
  let pointerOrigin: DOMPoint = node.createSVGPoint()
  let isPointerDown: boolean = false
  const scaleFactor = 1.025

  function getRealPointFromEvent(event: PointerEvent): DOMPoint {
    point.x = event.clientX
    point.y = event.clientY
    return DOMMatrix.fromMatrix(node.getScreenCTM() as DOMMatrix)
      .scale(1, -1)
      .translate(0, dY)
      .inverse().transformPoint(point)
  }
  
  function onPointerMove(event: PointerEvent) {
    const pointerPosition = getRealPointFromEvent(event)
    if (isPointerDown) {
      event.preventDefault()
      viewBox.x -= (pointerPosition.x - pointerOrigin.x)
      viewBox.y += (pointerPosition.y - pointerOrigin.y)
    } else {
      node.dispatchEvent(new CustomEvent<DOMPoint>('cursor', {detail: pointerPosition}))
    }
  }
  
  function onPointerDown(event: PointerEvent) {
    event.preventDefault()
    isPointerDown = true
    pointerOrigin = getRealPointFromEvent(event)
  }
  
  function onPointerUp() {
    isPointerDown = false
  }
  
  function onWheel(event: WheelEvent) {
    event.preventDefault();
    const scaleDelta =  event.deltaY < 0 ? 1 / scaleFactor : scaleFactor;
    
    point.x = event.clientX;
    point.y = event.clientY;
    const startPoint = point.matrixTransform(node.getScreenCTM()?.inverse());
    viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1);
    viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1);
    viewBox.width *= scaleDelta;
    viewBox.height *= scaleDelta;
  }
  
  const options: AddEventListenerOptions = {passive: false, capture: true}
  node.addEventListener('pointerdown', onPointerDown, options)
  node.addEventListener('pointermove', onPointerMove, options)
  node.addEventListener('pointerup', onPointerUp, options)
  node.addEventListener('pointercancel', onPointerUp, options)
  node.addEventListener('wheel', onWheel, options)
  
  
  return {
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown, options)
      node.removeEventListener('pointermove', onPointerMove, options)
      node.removeEventListener('pointerup', onPointerUp, options)
      node.removeEventListener('pointercancel', onPointerUp, options)
      node.removeEventListener('wheel', onWheel, options)
    },
  }
}
