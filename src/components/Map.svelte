<svelte:options namespace="svg"/>
<script lang="ts">
  import SvgCartesian from './svg/SvgCartesian.svelte'

  let width: number
  let height: number
  export let initialViewBox: DOMRect = {x: 365000, y: 6375000, width: 740000 - 365000, height: 6635000 - 6375000}
  $: viewBox = initialViewBox
  let zoomLevel = 0
  $: unitsPerPixel = (width && height && viewBox) ? Math.max(viewBox.width / width, viewBox.height / height) : 4000
  $: zoomLevel = Math.max(Math.min(Math.round(Math.log2(4000 / unitsPerPixel)), 14), 0)

</script>
<SvgCartesian bind:height bind:width
              on:viewboxchanged={(e:CustomEvent<DOMRect>)=>viewBox=e.detail}
              on:cursormoved
              viewBox={initialViewBox}>
  <slot {viewBox} {zoomLevel}/>
</SvgCartesian>
