import {mousePoint, touchPoint, twoTouchDistance} from '$lib/graphics'
import type {ActionReturn} from 'svelte/action'

let screenToRealMatrix: DOMMatrix
let isDragging = false
let startingPoint: DOMPoint | undefined = undefined

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
        startDrag(touchPoint(event))
        break
      case 2:
        twoFingerDistance = twoTouchDistance(event)
    }
  }
  
  function getScreenToRealMatrix(viewBox: DOMRect) {
    return (DOMMatrix.fromMatrix(node.getScreenCTM() as DOMMatrix))
      .scale(1, -1)
      .translate(0, -((2 * viewBox.y + viewBox.height)))
      .inverse()
  }
  
  function startDrag(current: DOMPoint) {
    screenToRealMatrix = getScreenToRealMatrix(viewBox)
    startingPoint = screenToRealMatrix.transformPoint(current)
    isDragging = true
    return false
  }
  
  function endDrag() {
    isDragging = false
    startingPoint = undefined
  }
  
  function move(current: DOMPoint) {
    if (isDragging && startingPoint) {
      const deltaX = current.x - startingPoint.x
      const deltaY = current.y - startingPoint.y
      node.dispatchEvent(new CustomEvent<PanEventDetail>('pan', {detail: {deltaY, deltaX}}))
      startingPoint = current
    }
    node.dispatchEvent(new CustomEvent<DOMPoint>('cursor', {detail: current}))
  }
  
  function mousemove(event: MouseEvent) {
    move(screenToRealMatrix.transformPoint(mousePoint(event)))
  }
  
  
  const touchMove = (event: TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const currentDistance = twoTouchDistance(event)
    if (event.touches.length === 1) {
      move(screenToRealMatrix.transformPoint(touchPoint(event)))
    } else {
      if (twoFingerDistance && currentDistance) {
        Math.sign(currentDistance - twoFingerDistance)
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
    event.preventDefault()
    startDrag(mousePoint(event))
  }
  
  const options: AddEventListenerOptions = {passive: false, capture: true}
  node.addEventListener('wheel', handleWheel, options)
  node.addEventListener('touchstart', touchStart, options)
  node.addEventListener('touchmove', touchMove, options)
  node.addEventListener('touchend', endDrag, options)
  node.addEventListener('touchcancel', endDrag, options)
  node.addEventListener('mousedown', mouseDown, options)
  node.addEventListener('mouseup', endDrag, options)
  node.addEventListener('mousemove', mousemove, options)
  node.addEventListener('mouseleave', endDrag, options)
  
  return {
    update() {
      viewBox = node.viewBox.baseVal
      screenToRealMatrix = getScreenToRealMatrix(viewBox)
    },
    destroy() {
      node.removeEventListener('wheel', handleWheel, options)
      node.removeEventListener('touchstart', touchStart, options)
      node.removeEventListener('touchmove', touchMove, options)
      node.removeEventListener('touchend', endDrag, options)
      node.removeEventListener('touchcancel', endDrag, options)
      node.removeEventListener('mousedown', mouseDown, options)
      node.removeEventListener('mouseup', endDrag, options)
      node.removeEventListener('mousemove', mousemove, options)
      node.removeEventListener('mouseleave', endDrag, options)
    },
  }
}
