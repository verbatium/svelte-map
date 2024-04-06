import {twoTouchDistance} from '$lib/graphics'
import type {ActionReturn} from 'svelte/action'

let screenToRealMatrix: DOMMatrix
//let matrix: DOMMatrix

let isDragging = false
let startingPoint: DOMPoint | undefined = undefined

//let delta: DOMPoint | undefined = undefined

export interface PanEventDetail {
  deltaY: number;
  deltaX: number;
}

interface Attributes {
  'on:zoomIn'?: (e: CustomEvent<void>) => void;
  'on:zoomOut'?: (e: CustomEvent<void>) => void;
  'on:pan'?: (e: CustomEvent<PanEventDetail>) => void;
  'on:cursor'?: (e: CustomEvent<DOMPoint>) => void;
}

export function zoom(node: SVGSVGElement): ActionReturn<{}, Attributes> {
  let viewBox = node.viewBox.baseVal
  screenToRealMatrix = getScreenToRealMatrix(viewBox)
  
  const handleWheel = (event: WheelEvent) => {
    const {deltaY, deltaX} = event
    event.preventDefault()
    if (!Number.isInteger(deltaY) && deltaX == 0) {
      if (deltaY < 0) {
        node.dispatchEvent(new CustomEvent('zoomIn'))
      } else {
        node.dispatchEvent(new CustomEvent('zoomOut'))
      }
    } else {
      node.dispatchEvent(new CustomEvent<PanEventDetail>('pan', {detail: {deltaY, deltaX}}))
    }
  }
  
  let twoFingerDistance: number | undefined = undefined
  
  const touchStart = (event: TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    switch (event.touches.length) {
      case 1:
        startDrag(event)
        break
      case 2:
        twoFingerDistance = twoTouchDistance(event)
    }
  }
  
  const touchend = (event: TouchEvent) => {
    endDrag(event)
  }
  
  function getScreenToRealMatrix(viewBox: DOMRect) {
    return (DOMMatrix.fromMatrix(node.getScreenCTM() as DOMMatrix))
      .scale(1, -1)
      .translate(0, -(( 2 * viewBox.y + viewBox.height)))
      .inverse()
  }
  
  function startDrag(event: MouseEvent | TouchEvent) {
    screenToRealMatrix = getScreenToRealMatrix(viewBox)
    startingPoint = screenToRealMatrix.transformPoint(screenPoint(event))
    console.log('startingPoint', startingPoint)
    isDragging = true
    return false
  }
  
  function endDrag(event: MouseEvent | TouchEvent) {
    isDragging = false
    startingPoint = undefined
  }
  
  function mousemove(event: MouseEvent | TouchEvent) {
    const current = screenToRealMatrix.transformPoint(screenPoint(event))
    if (isDragging && startingPoint) {
      const deltaX = current.x - startingPoint.x
      const deltaY = (current.y - startingPoint.y)
      node.dispatchEvent(new CustomEvent<PanEventDetail>('pan', {detail: {deltaY, deltaX}}))
      startingPoint = current
    }
    node.dispatchEvent(new CustomEvent<DOMPoint>('cursor', {detail: current}))
  }
  
  function screenPoint(event: MouseEvent | TouchEvent): DOMPoint {
    if (event instanceof MouseEvent) {
      return new DOMPoint(event.clientX, event.clientY)
    } else if (event instanceof TouchEvent) {
      return new DOMPoint(event.touches[0].clientX, event.touches[0].clientY)
    } else {
      return new DOMPoint(0, 0)
    }
  }
  
  
  const touchMove = (event: TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const currentDistance = twoTouchDistance(event)
    if (event.touches.length === 1) {
      mousemove(event)
    } else {
      if (twoFingerDistance && currentDistance) {
        if (currentDistance - twoFingerDistance > 0) {
          node.dispatchEvent(new CustomEvent('zoomIn'))
        } else {
          node.dispatchEvent(new CustomEvent('zoomOut'))
        }
      }
    }
    twoFingerDistance = currentDistance
  }
  
  function mouseDown(event: MouseEvent) {
    startDrag(event)
  }
  
  const options: AddEventListenerOptions = {passive: false, capture: true}
  node.addEventListener('wheel', handleWheel, options)
  node.addEventListener('touchstart', touchStart, options)
  node.addEventListener('touchmove', touchMove, options)
  node.addEventListener('touchend', touchend, options)
  node.addEventListener('touchcancel', touchend, options)
  node.addEventListener('mousedown', mouseDown, options)
  node.addEventListener('mouseup', endDrag, options)
  node.addEventListener('mousemove', mousemove, options)
  node.addEventListener('mouseleave', endDrag, options)
  
  return {
    update(parameter: {}) {
      viewBox = node.viewBox.baseVal
      screenToRealMatrix = getScreenToRealMatrix(viewBox)
    },
    destroy() {
      node.removeEventListener('wheel', handleWheel, options)
      node.removeEventListener('touchstart', touchStart, options)
      node.removeEventListener('touchmove', touchMove, options)
      node.removeEventListener('touchend', touchend, options)
      node.removeEventListener('touchcancel', touchend, options)
      node.removeEventListener('mousedown', mouseDown, options)
      node.removeEventListener('mouseup', endDrag, options)
      node.removeEventListener('mouseleave', endDrag, options)
      node.removeEventListener('mousemove', mousemove, options)
    },
  }
}
