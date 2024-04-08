<!--https://developers.kartes.lv/en/wms/-->
<!--PROJCS["LKS-92 / Latvia TM",-->
<!--GEOGCS["LKS-92",-->
<!--DATUM["Latvian_geodetic_coordinate_system_1992",-->
<!--SPHEROID["GRS 1980",6378137,298.257222101],-->
<!--TOWGS84[0,0,0,0,0,0,0]],-->
<!--PRIMEM["Greenwich",0,-->
<!--AUTHORITY["EPSG","8901"]],-->
<!--UNIT["degree",0.0174532925199433,-->
<!--AUTHORITY["EPSG","9122"]],-->
<!--AUTHORITY["EPSG","4661"]],-->
<!--PROJECTION["Transverse_Mercator"],-->
<!--PARAMETER["latitude_of_origin",0],-->
<!--PARAMETER["central_meridian",24],-->
<!--PARAMETER["scale_factor",0.9996],-->
<!--PARAMETER["false_easting",500000],-->
<!--PARAMETER["false_northing",-6000000],-->
<!--UNIT["metre",1,-->
<!--AUTHORITY["EPSG","9001"]],-->
<!--AUTHORITY["EPSG","3059"]]-->
<!--https://xgis.maaamet.ee/xgis2/service/1mm2i1r?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=cells263&WIDTH=761&HEIGHT=992&SRS=EPSG%3A3301&BBOX=494252.92068503355%2C6552719.906828617%2C534249.9375748499%2C6604857.936729665-->
<script lang="ts">
  import {debounce} from '$lib/debounce'
  import type {Point} from '$lib/graphics'

  function getUrl(viewBox: DOMRect): string {
    let url = new URL('https://xgis.maaamet.ee/xgis2/service/1mm2i1r')
    url.searchParams.set('REQUEST', 'GetMap')
    url.searchParams.set('SERVICE', 'WMS')
    url.searchParams.set('VERSION', '1.1.1')
    url.searchParams.set('FORMAT', 'image/png')
    url.searchParams.set('STYLES', '')
    url.searchParams.set('TRANSPARENT', 'true')
    url.searchParams.set('LAYERS', 'cells263')
    url.searchParams.set('WIDTH', g.ownerSVGElement.clientWidth)
    url.searchParams.set('HEIGHT', g.ownerSVGElement.clientHeight)
    url.searchParams.set('SRS', 'EPSG:3301')
    // `494252.92068503355,6552719.906828617,534249.9375748499,6604857.936729665`
    const bbox = `${viewBox.x},${viewBox.y},${viewBox.x + viewBox.width},${viewBox.y + viewBox.height}`
    url.searchParams.set('BBOX', bbox)
    return url.toString()
  }

  export let zoomLevel: number
  export let viewBox: DOMRect
  let g: SVGElement


  let visibleTiles: Map<number, Point[]> = new Map()
  let layers: number[] = []
  let tilesPerAxis: number

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: g && viewBox && debouncedTileCalculator(viewBox, zoomLevel)

  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    tilesPerAxis = Math.pow(2, zoomLevel)
    visibleTiles.set(zoomLevel, getTiles(tilesPerAxis, viewBox))
    visibleTiles = new Map(visibleTiles)
    layers = [zoomLevel]
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
  {#each layers as level (level)}
    {#each visibleTiles.get(level) as tile (tile.href)}
      <g transform="matrix(1 0 0 -1 0 {2 * tile.y + tile.height})">
        <image x="{tile.x}" y="{tile.y}" href={tile.href} width="{tile.width}" height="{tile.height}"/>
      </g>
    {/each}
  {/each}
</g>