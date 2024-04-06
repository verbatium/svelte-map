<svelte:options namespace="svg"/>
<script lang="ts">
  import type {PanEventDetail} from './Zoom'
  import {zoom} from './Zoom'
  import MapLayer from './MapLayer.svelte'
  import {afterUpdate} from 'svelte'

  let svgElement: SVGElement
  let zoomLevel = 3
  let viewBox: DOMRect = {
    x: 365000,
    y: 6375000,
    width: 740000 - 365000,
    height: 6635000 - 6375000,
  }

  let width: number = 0
  let height: number = 0

  afterUpdate(() => {
    width = svgElement?.clientWidth
    height = svgElement?.clientHeight
  })

  let cursor: DOMPoint

  async function getCapabilities() {
    //const url = 'https://teenus.maaamet.ee/ows/ajakohane-haldusjaotus?service=wms&version=1.3.0&request=GetCapabilities';
    // tileMapService = await downloadTileMapService('https://tiles.maaamet.ee/tm/tms/1.0.0/')
  }

  function zoomIn() {
    console.log('zoomIn')
  }

  function zoomOut() {
    console.log('zoomOut')
  }

  function doZoom(value: number) {
    let newZoomLevel = Math.max(Math.min(zoomLevel + value, 14), 0)
    if (zoomLevel ! - newZoomLevel) {
      zoomLevel = newZoomLevel
      const centerX = viewBox.x + viewBox.width / 2
      const centerY = viewBox.y + viewBox.height / 2
      const newWidth = value > 0 ? viewBox.width / 2 : viewBox.width * 2
      const newHeight = value > 0 ? viewBox.height / 2 : viewBox.height * 2
      viewBox = {
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight,

      }
    }
  }

  function pan(event: CustomEvent<PanEventDetail>) {
    viewBox = {...viewBox, x: viewBox.x - event.detail.deltaX, y: viewBox.y - event.detail.deltaY}
  }
</script>

<button class="border" onclick={getCapabilities}>getCapabilities</button>
<button class="border-amber-600 border-2 m-3 p-3" onclick={()=>doZoom(-1)}>-</button>
<button class="border-amber-600 border-2  m-3 p-3" onclick={()=>doZoom(+1)}>+</button>
<div>Zoom: {zoomLevel}</div>
<div>Location: {Math.round(cursor?.x,2)}, {Math.round(cursor?.y,2)}</div>
<div>Size: {width}, {height}</div>
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
    <MapLayer tileMapUrl="https://tiles.maaamet.ee/tm/tms/1.0.0/epk_vv@LEST" zoomLevel={zoomLevel} viewBox={viewBox}/>
    {#each [0, 256, 512, 768, 1025] as x}
      <line x1="0" y1="{x}" x2="1024" y2="{x}" stroke="black"></line>
      <line x1={x} y1="0" x2="{x}" y2="1024" stroke="black"></line>
    {/each}
  </g>
</svg>
