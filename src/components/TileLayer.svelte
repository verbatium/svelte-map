<svelte:options namespace="svg"/>
<script lang="ts">
  import {debounce} from '$lib/debounce'
  import {epsg3301Tiles} from '$lib/tms/Epsg3301Tiles'

  export let tileMapUrl: string
  export let zoomLevel: number
  export let viewBox: DOMRect
  export let transparent = false


  function getTiles(viewBox: DOMRect): { href: string; x: number; y: number } [] {
    return epsg3301Tiles.visibleTilesByClientViewBox(viewBox, zoomLevel).map(([x, y]) => ({
        x: epsg3301Tiles.tileSize * x,
        y: -epsg3301Tiles.tileSize * (y + 1),
        href: `${tileMapUrl}/${zoomLevel}/${x}/${y}`,
      }),
    )
  }

  let visibleTiles: Map<number, { x: number, y: number, href: string }[]> = new Map()
  let layers: number[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: viewBox && debouncedTileCalculator(viewBox, zoomLevel)


  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    visibleTiles.set(zoomLevel, getTiles(viewBox))
    visibleTiles = new Map(visibleTiles)
    if (transparent) {
      layers = [zoomLevel]
    } else {
      layers = Array.from(visibleTiles.keys()).filter(l => l <= zoomLevel).sort((a, b) => a - b)
    }
  }

</script>
<g transform="translate({epsg3301Tiles.originX}, {epsg3301Tiles.originY})">
  {#each layers as level (level)}
    <g transform="scale({epsg3301Tiles.unitsPerPixel(level)},{-(epsg3301Tiles.unitsPerPixel(level))})">
      {#each visibleTiles?.get(level) ?? [] as tile (tile.href)}
        <image href={tile.href} transform="translate({Math.floor(tile.x)}, {Math.floor(tile.y)})"/>
      {/each}
    </g>
  {/each}
</g>