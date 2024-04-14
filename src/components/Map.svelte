<svelte:options namespace="svg"/>
<script lang="ts">
  import type {PanEventDetail} from './Zoom'
  import {zoom} from './Zoom'
  import {afterUpdate} from 'svelte'
  import {lest97} from '$lib/lamber'
  import {limitNumberToRange} from '$lib/graphics'

  let svgElement: SVGElement
  let zoomSpeed = 0.05
  let zoomLevel = 4
  let z = 4
  $: z = Math.floor(zoomLevel)
  $: changeViewBox(zoomLevel)
  let maxWidth = 740000 - 365000
  let maxHeight = 6635000 - 6375000
  let viewBox: DOMRect = {x: 365000, y: 6375000, width: maxWidth, height: maxHeight}
  let width: number = 0
  let height: number = 0

  afterUpdate(() => {
    width = svgElement?.clientWidth
    height = svgElement?.clientHeight
  })

  let cursor: DOMPoint
  let latLon: number[]
  $: latLon = lest97.inverseConversion(cursor?.x ?? 0, cursor?.y ?? 0)

  function zoomIn() {
    zoomLevel = limitNumberToRange(zoomLevel + zoomSpeed, 0, 14.95)
  }

  function zoomOut() {
    zoomLevel = limitNumberToRange(zoomLevel - zoomSpeed, 0, 14.95)
  }

  function changeViewBox(zoomLevel: number) {
    var k = Math.pow(2, zoomLevel - 4)

    const centerX = viewBox.x + viewBox.width / 2
    const centerY = viewBox.y + viewBox.height / 2
    const newWidth = maxWidth / k
    const newHeight = maxHeight / k
    viewBox = {
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    }

  }

  function pan(event: CustomEvent<PanEventDetail>) {
    viewBox = {...viewBox, x: viewBox.x - event.detail.deltaX, y: viewBox.y - event.detail.deltaY}
  }
</script>

<svg
  {...$$restProps}
  bind:this={svgElement}
  class="w-full touch-none {$$props.class ?? ''}"
  on:cursor={(e)=>{cursor = e.detail}}
  on:pan={pan}
  on:zoomIn={zoomIn}
  on:zoomOut={zoomOut}
  role="presentation"
  use:zoom={{zoomLevel, width, height}}
  viewBox="{viewBox.x} {viewBox.y} {viewBox.width} {viewBox.height}"
  xmlns="http://www.w3.org/2000/svg"
>
  <g transform="matrix(1 0 0 -1 0 {2 * viewBox.y + viewBox.height})">
    <slot {viewBox} zoomLevel={z}/>
  </g>
</svg>
