<svelte:options namespace="svg"/>
<script lang="ts">
  import type {PanEventDetail} from './Zoom'
  import {zoom} from './Zoom'
  import TileLayer from './TileLayer.svelte'
  import {afterUpdate} from 'svelte'
  import {lest97} from '$lib/lamber'
  import {limitNumberToRange} from '$lib/graphics'

  let svgElement: SVGElement
  let zoomSpeed = 0.05
  let zoomLevel = 3
  let z = 3
  $: z = Math.ceil(zoomLevel)
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
    zoomLevel = limitNumberToRange(zoomLevel + zoomSpeed, 0, 14)
    console.log('zoomIn')
  }

  function zoomOut() {
    zoomLevel = limitNumberToRange(zoomLevel - zoomSpeed, 0, 14)
    console.log('zoomOut')
  }

  function doZoom(value: number) {
    zoomLevel = limitNumberToRange(zoomLevel + value, 0, 14)
  }

  function changeViewBox(zoomLevel: number) {
    var k = Math.pow(2, zoomLevel-3)

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
<button class="border-amber-600 border-2 m-3 p-3" onclick={()=>doZoom(-1)}>-</button>
<button class="border-amber-600 border-2  m-3 p-3" onclick={()=>doZoom(+1)}>+</button>
<span class="ml-2">Zoom: {zoomLevel} Location: {Math.round(cursor?.x)}, {Math.round(cursor?.y)} ({Math.round(latLon[0] * 10000)/10000}
  , {Math.round(latLon[1]*10000)/10000}) {z}</span>
<svg
  {...$$restProps}
  bind:this={svgElement}
  class="h-screen w-full touch-none {$$props.class ?? ''}"
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
    <TileLayer tileMapUrl="https://tiles.maaamet.ee/tm/tms/1.0.0/foto@LEST" viewBox={viewBox} zoomLevel={z}/>
    <TileLayer tileMapUrl="https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@LEST" viewBox={viewBox} zoomLevel={z} transparent="true"/>
  </g>
</svg>
