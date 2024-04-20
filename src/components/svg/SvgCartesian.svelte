<script lang="ts">
  import {panZoom} from '../PanZoom'

  export let viewBox: DOMRect
  export let width: number = 100
  export let height: number = 100
  let cartesianMatrix = [1, 0, 0, -1, -viewBox.x, viewBox.height + viewBox.y]
  let viewBoxString = `0,0,${viewBox.width},${viewBox.height}`
  let transform = `matrix(${cartesianMatrix.join(',')})`
  let svg: SVGSVGElement

  $: setViewBox(svg, viewBox)

  function setViewBox(svg: SVGSVGElement, viewBox: DOMRect) {
    if (!svg) return
    svg.viewBox.baseVal.x = 0
    svg.viewBox.baseVal.y = 0
    svg.viewBox.baseVal.width = viewBox.width
    svg.viewBox.baseVal.height = viewBox.height
    resize()
  }

  function resize() {
    if (!svg) return
    width = svg.clientWidth ?? 100
    height = svg.clientHeight ?? 100
  }

</script>
<svelte:window on:resize={resize} class="pointer-events-none"/>
<svg {...$$restProps}
     bind:this={svg}
     class=""
     cursor="crosshair"
     on:cursormoved
     on:viewboxchanged
     use:panZoom={{inverseMatrix: new DOMMatrix(cartesianMatrix)?.inverse()}}
     viewBox={viewBoxString}
     style="pointer-events: all"
>
  <g transform={transform}>
    <slot/>
  </g>
</svg>