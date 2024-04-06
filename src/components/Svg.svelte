<script lang="ts">
  import type {PanEventDetail} from './Zoom'
  import {zoom} from './Zoom'

  let zoomLevel = 1
  let svgElement

  function zoomIn() {
    zoomLevel = Math.min(Math.max(0, zoomLevel + 0.1), 200)
  }

  function zoomOut() {
    zoomLevel = Math.min(Math.max(0, zoomLevel - 0.1), 200)
  }

  function pan(event: CustomEvent<PanEventDetail>) {
     event.detail.deltaX
     event.detail.deltaY
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
  <slot/>
</svg>
