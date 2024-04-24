<svelte:options namespace="svg"/>
<script lang="ts">
  import {debounce} from '$lib/debounce'
  import {epsg3301Tiles} from '$lib/tms/Epsg3301Tiles'

  export let tileMapUrl: string
  export let zoomLevel: number
  export let viewBox: DOMRect
  export let transparent = false


  function getTiles(viewBox: DOMRect): { href: string; x: number; y: number, width: number, height: number } [] {
    return epsg3301Tiles.visibleTilesByClientViewBox(viewBox, zoomLevel)
      .map(([x, y]) => {
          let bboxByTileXY = epsg3301Tiles.bboxByTileXY(x, y, zoomLevel)
          return {
            x: bboxByTileXY.x,
            y: bboxByTileXY.y,
            width: bboxByTileXY.width,
            height: bboxByTileXY.height,
            href: `${tileMapUrl}/${zoomLevel}/${x}/${y}`,
          }
        },
      )
  }

  let visibleTiles: Map<number, { href: string; x: number; y: number, width: number, height: number }[]> = new Map()
  let zoomLevels: number[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 20)
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
{#each zoomLevels as level (level)}
  {#each visibleTiles?.get(level) ?? [] as tile (tile.href)}
    <g transform="translate({tile.x}, {tile.y}) scale(1,-1) translate(0,{-tile.height})">
      <image href={tile.href} width={tile.width} height={tile.height}/>
      <rect width={tile.width} height={tile.height} stroke="black" stroke-width="1" vector-effect="non-scaling-stroke"
            fill="none"/>
    </g>
  {/each}
{/each}