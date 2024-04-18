<script lang="ts">
  import {debounce} from '$lib/debounce'
  import type {Point} from '$lib/graphics'

  export let baseUrl = 'https://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri'
  export let srs = 'EPSG:3301'
  export let layers = 'cells'
  export let styles = 'style-id-2142'
  export let mapFormat = 'image/png'

  function getUrl(viewBox: DOMRect): string {
    let url = new URL(baseUrl)
    url.searchParams.set('REQUEST', 'GetMap')
    url.searchParams.set('SERVICE', 'WMS')
    url.searchParams.set('VERSION', '1.1.1')
    url.searchParams.set('FORMAT',mapFormat )
    url.searchParams.set('STYLES', styles)
    url.searchParams.set('TRANSPARENT', 'true')
    url.searchParams.set('LAYERS', layers)
    url.searchParams.set('WIDTH', g.ownerSVGElement.clientWidth)
    url.searchParams.set('HEIGHT', g.ownerSVGElement.clientHeight)
    url.searchParams.set('SRS', srs)
    const bbox = `${viewBox.x},${viewBox.y},${viewBox.x + viewBox.width},${viewBox.y + viewBox.height}`
    url.searchParams.set('BBOX', bbox)
    return url.toString()
  }

  export let zoomLevel: number
  export let viewBox: DOMRect
  let g: SVGElement


  let visibleTiles: Map<number, Point[]> = new Map()
  let tileLayers: number[] = []
  let tilesPerAxis: number

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: g && viewBox && debouncedTileCalculator(viewBox, zoomLevel)

  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    tilesPerAxis = Math.pow(2, zoomLevel)
    visibleTiles.set(zoomLevel, [...visibleTiles.get(zoomLevel) ?? [], ...getTiles(tilesPerAxis, viewBox)])
    visibleTiles = new Map(visibleTiles)
    tileLayers = [zoomLevel]
  }

  function getTiles(tilesPerAxis: number, viewBox: DOMRect): Point [] {
    let screenToRealMatrix = getScreenToRealMatrix(viewBox)
    let boundingClientRect = g.ownerSVGElement.getBoundingClientRect()
    let domPoint = screenToRealMatrix.transformPoint(new DOMPoint(boundingClientRect.x, boundingClientRect.y))
    let domPoint2 = screenToRealMatrix.transformPoint(new DOMPoint(boundingClientRect.x + boundingClientRect.width,
      boundingClientRect.y + boundingClientRect.height))
    let element = {
      x: domPoint.x,
      y: domPoint.y,
      width: domPoint2.x - domPoint.x,
      height: domPoint2.y - domPoint.y,
      href: getUrl(new DOMRect(domPoint.x, domPoint.y, domPoint2.x - domPoint.x, domPoint2.y - domPoint.y)),
    }
    return [element]
  }

  function getScreenToRealMatrix(viewBox: DOMRect) {
    return (DOMMatrix.fromMatrix(g.getScreenCTM() as DOMMatrix))
      .scale(1, -1)
      .translate(0, -((2 * viewBox.y + viewBox.height)))
      .inverse()
  }
</script>


<g bind:this={g}>
  {#each tileLayers as level (level)}
    {#each visibleTiles.get(level) as tile (tile.href)}
      <g transform="matrix(1 0 0 -1 0 {2 * tile.y + tile.height})">
        <image x="{tile.x}" y="{tile.y}" href={tile.href} width="{tile.width}" height="{tile.height}"/>
      </g>
    {/each}
  {/each}
</g>