<script lang="ts">
  import {debounce} from '$lib/debounce'
  import {Epsg3301Tiles} from '$lib/tms/Epsg3301Tiles'

  let tileSystem = new Epsg3301Tiles({tileSize: 512})
  export let baseUrl = 'https://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri'
  export let srs = 'EPSG:3301'
  export let layers = 'cells'
  export let styles = 'style-id-2142'
  export let mapFormat = 'image/png'
  export let transparent = true
  $: id = baseUrl.replace('https://', '').replaceAll('/', '_').replaceAll('.', '_')

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


  function getTiles(viewBox: DOMRect): TileData[] {
    return tileSystem.visibleTilesByClientViewBox(viewBox, zoomLevel)
      .map(([x, y]) => {
          let bboxByTileXY = tileSystem.bboxByTileXY(x, y, zoomLevel, 10) as DOMRect
          let clipBboxByTileXY = tileSystem.bboxByTileXY(x, y, zoomLevel) as DOMRect
          return {
            id: `${id}_${zoomLevel}_${x}_${y}`,
            clipBbox: clipBboxByTileXY,
            imageBbox: bboxByTileXY,
            href: getUrl(bboxByTileXY, tileSystem.tileSize, tileSystem.tileSize),
          }
        },
      )
  }

  interface TileData {
    id: string
    href: string
    imageBbox: DOMRect
    clipBbox: DOMRect
  }

  let visibleTiles: Map<number, TileData[]> = new Map()
  let zoomLevels: number[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 10)
  $: debouncedTileCalculator(viewBox, zoomLevel)

  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    visibleTiles.set(zoomLevel, getTiles(viewBox))
    visibleTiles = new Map(visibleTiles)
    if (transparent) {
      zoomLevels = [zoomLevel]
    } else {
      zoomLevels = Array.from(visibleTiles.keys()).filter(l => l <= zoomLevel).sort((a, b) => a - b)
    }
  }
</script>


{#each zoomLevels as level}
  {#each visibleTiles?.get(level) ?? [] as tile (tile.href)}
    <g transform="translate({tile.imageBbox.x}, {tile.imageBbox.y}) scale(1,-1) translate(0,{-tile.imageBbox.height})">
      <defs>
        <clipPath id="{tile.id}_cp" >
          <rect  x="{tile.clipBbox.x- tile.imageBbox.x}" y="{tile.clipBbox.y - tile.imageBbox.y}"
                width={tile.clipBbox.width} height={tile.clipBbox.height}/>
        </clipPath>
      </defs>
      <image clip-path="url(#{tile.id}_cp)" href={tile.href} width={tile.imageBbox.width} height={tile.imageBbox.height}/>
      <rect x="{tile.clipBbox.x- tile.imageBbox.x}" y="{tile.clipBbox.y - tile.imageBbox.y}"
            width={tile.clipBbox.width} height={tile.clipBbox.height}
            stroke="black" stroke-width="1" vector-effect="non-scaling-stroke"
            fill="none"/>
    </g>
  {/each}
{/each}