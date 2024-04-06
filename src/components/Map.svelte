<svelte:options namespace="svg"/>
<script lang="ts">
  import type {PanEventDetail} from './Zoom'
  import {zoom} from './Zoom'
  import MapLayer from './MapLayer.svelte'

  let svgElement: SVGElement
  let zoomLevel = 0
  let viewBox = {
    x: 365000,
    y: 6375000,
    width: 740000 - 365000,
    height: 6635000 - 6375000,
  }

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

  function pan(event: CustomEvent<PanEventDetail>) {
    viewBox = {...viewBox, x: viewBox.x - event.detail.deltaX, y: viewBox.y - event.detail.deltaY}
  }
</script>

<button class="border" onclick={getCapabilities}>getCapabilities</button>
<button class="border-amber-600 border-2 m-3 p-3" onclick={()=>zoomLevel = Math.min(zoomLevel - 1, 14)}>-</button>
<button class="border-amber-600 border-2  m-3 p-3" onclick={()=>zoomLevel = Math.max(zoomLevel + 1, 0)}>+</button>
<div>Zoom: {zoomLevel}</div>
<div>Location: {cursor?.x}, {cursor?.y}</div>
<svg
  {...$$restProps}
  bind:this={svgElement}
  class="h-screen w-full touch-none {$$props.class ?? ''}"
  viewBox="{viewBox.x} {viewBox.y} {viewBox.width} {viewBox.height}"
  xmlns="http://www.w3.org/2000/svg"
  use:zoom
  on:pan={pan}
  on:zoomIn={zoomIn}
  on:zoomOut={zoomOut}
  on:cursor={(e)=>{cursor = e.detail}}
  role="presentation"
>
  <g transform="matrix(1 0 0 -1 0 {6635000 + 6375000})">
    <MapLayer tileMapUrl="https://tiles.maaamet.ee/tm/tms/1.0.0/epk_vv@LEST" zoomLevel={zoomLevel}/>
    {#each [0, 256, 512, 768, 1025] as x}
      <line x1="0" y1="{x}" x2="1024" y2="{x}" stroke="black"></line>
      <line x1={x} y1="0" x2="{x}" y2="1024" stroke="black"></line>
    {/each}
  </g>
</svg>
