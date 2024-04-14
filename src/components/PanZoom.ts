import type {ActionReturn} from 'svelte/action'

type UseParam = { scaleFactor: number, inverseMatrix: DOMMatrix }

interface Attributes {
  'on:cursor'?: (e: CustomEvent<DOMPoint>) => void;
  'on:viewboxchanged'?: (e: CustomEvent<DOMRect>) => void;
}

export function panZoom(node: SVGSVGElement, param: UseParam): ActionReturn<UseParam, Attributes> {
  let scaleFactor = param?.scaleFactor ?? 1.025
  let inverseMatrix = param?.inverseMatrix
  const viewBox: DOMRect = node.viewBox.baseVal
  let pointerOrigin: DOMPoint = node.createSVGPoint()
  let isPointerDown: boolean = false
  
  function getRealPointFromEvent(event: PointerEvent): DOMPoint {
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(node.getScreenCTM()?.inverse())
  }
  
  function onPointerMove(event: PointerEvent) {
    const pointerPosition = getRealPointFromEvent(event)
    if (isPointerDown) {
      event.preventDefault()
      viewBox.x -= (pointerPosition.x - pointerOrigin.x)
      viewBox.y -= (pointerPosition.y - pointerOrigin.y)
      node.dispatchEvent(new CustomEvent<DOMRect>('viewboxchanged', {detail: transformRect(inverseMatrix, viewBox)}))
    } else {
      node.dispatchEvent(new CustomEvent<DOMPoint>('cursor', {detail: pointerPosition.matrixTransform(inverseMatrix)}))
    }
  }
  
  function transformRect(m: DOMMatrix, r: DOMRect): DOMRect {
    const matrix = m.translate(0, r.height)
    const p = new DOMPoint(r.x, r.y).matrixTransform(matrix)
    const p2 = new DOMPoint(r.x + r.width, r.y + r.height).matrixTransform(matrix)
    return new DOMRect(p.x, p.y, p2.x - p.x,  p.y - p2.y)
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
    event.preventDefault()
    const scaleDelta = event.deltaY < 0 ? 1 / scaleFactor : scaleFactor
    const startPoint = new DOMPoint(event.clientX, event.clientY).matrixTransform(node.getScreenCTM()?.inverse())
    viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1)
    viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1)
    viewBox.width *= scaleDelta
    viewBox.height *= scaleDelta
    node.dispatchEvent(new CustomEvent<DOMRect>('viewboxchanged', {detail: transformRect(inverseMatrix, viewBox)}))
  }
  
  const options: AddEventListenerOptions = {passive: false, capture: true}
  node.addEventListener('pointerdown', onPointerDown, options)
  node.addEventListener('pointermove', onPointerMove, options)
  node.addEventListener('pointerup', onPointerUp, options)
  node.addEventListener('pointercancel', onPointerUp, options)
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
      node.removeEventListener('wheel', onWheel, options)
    },
  }
}
