<script lang="ts">
  import {debounce} from '$lib/debounce'
  import {epsg3301Tiles} from '$lib/tms/Epsg3301Tiles'

  export let baseUrl = 'https://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri'
  export let srs = 'EPSG:3301'
  export let layers = 'cells'
  export let styles = 'style-id-2142'
  export let mapFormat = 'image/png'
  export let transparent = true

  function getUrl(viewBox: {
    x: number,
    y: number,
    width: number,
    height: number
  }, width: number, height: number): string {
    let url = new URL(baseUrl)
    url.searchParams.set('REQUEST', 'GetMap')
    url.searchParams.set('SERVICE', 'WMS')
    url.searchParams.set('VERSION', '1.1.1')
    url.searchParams.set('FORMAT', mapFormat)
    url.searchParams.set('STYLES', styles)
    url.searchParams.set('TRANSPARENT', '' + transparent)
    url.searchParams.set('LAYERS', layers)
    url.searchParams.set('WIDTH', '' + width)
    url.searchParams.set('HEIGHT', '' + height)
    url.searchParams.set('SRS', srs)
    const bbox = `${viewBox.x},${viewBox.y},${viewBox.x + viewBox.width},${viewBox.y + viewBox.height}`
    url.searchParams.set('BBOX', bbox)
    return url.toString()
  }

  export let zoomLevel: number
  export let viewBox: DOMRect


  function getTiles(viewBox: DOMRect): { href: string; x: number; y: number, width: number, height: number } [] {
    console.log('getTiles', viewBox )
    return epsg3301Tiles.visibleTilesByClientViewBox(viewBox, zoomLevel)
      .map(([x, y]) => {
          let bboxByTileXY = epsg3301Tiles.bboxByTileXY(x, y, zoomLevel)
          return {
            x: bboxByTileXY.x,
            y: bboxByTileXY.y,
            width: bboxByTileXY.width,
            height: bboxByTileXY.height,
            href: getUrl(bboxByTileXY, epsg3301Tiles.tileSize, epsg3301Tiles.tileSize),
          }
        },
      )
  }

  let visibleTiles: Map<number, { href: string; x: number; y: number, width: number, height: number }[]> = new Map()
  let zoomLevels: number[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: debouncedTileCalculator(viewBox, zoomLevel)

  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    console.log('calculateTiles')
    visibleTiles.set(zoomLevel, getTiles(viewBox))
    if (transparent) {
      zoomLevels = [zoomLevel]
    } else {
      zoomLevels = Array.from(visibleTiles.keys()).filter(l => l <= zoomLevel).sort((a, b) => a - b)
    }
  }
</script>


{#each zoomLevels as level}
  {#each visibleTiles?.get(level) ?? [] as tile (tile.href)}
    <g transform="translate({tile.x}, {tile.y}) scale(1,-1) translate(0,{-tile.height})">
      <image href={tile.href} width={tile.width} height={tile.height}/>
      <rect width={tile.width} height={tile.height} stroke="black" stroke-width="1" vector-effect="non-scaling-stroke"
            fill="none"/>
    </g>
  {/each}
{/each}