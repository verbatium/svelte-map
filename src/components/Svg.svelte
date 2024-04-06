<script lang="ts">
  import type {PanEventDetail} from './Zoom'
  import {zoom} from './Zoom'

  let zoomLevel = 1
  let deltaX = 0
  let deltaY = 0
  let svgElement

  function zoomIn() {
    zoomLevel = Math.min(Math.max(0, zoomLevel + 0.1), 200)
  }

  function zoomOut() {
    zoomLevel = Math.min(Math.max(0, zoomLevel - 0.1), 200)
  }

  function pan(event: CustomEvent<PanEventDetail>) {
    deltaX -= event.detail.deltaX
    deltaY -= event.detail.deltaY
  }
</script>

<svg
  {...$$restProps}
  bind:this={svgElement}
  class="touch-none {$$props.class ?? ''}"
  on:pan={pan}
  on:zoomIn={zoomIn}
  on:zoomOut={zoomOut}
  role="presentation"
  use:zoom
  xmlns="http://www.w3.org/2000/svg"
>
  <g transform="translate({deltaX}, {deltaY})">
    <g transform="scale({zoomLevel}) rotate(0)">
      <slot/>
    </g>
  </g>

  <!--  UI-->
  <g>
    <rect fill="white" height="300" stroke="white" width="200" x="0" y="0"/>
    <text y="3rem">deltaX: {deltaX} </text>
    <text y="4rem">deltaY: {deltaY} </text>
    <text y="5rem">zoom: {zoomLevel} </text>
    <circle cx={deltaX} cy={deltaY} fill="red" r={zoomLevel} stroke="cyan"></circle>
  </g>
</svg>
