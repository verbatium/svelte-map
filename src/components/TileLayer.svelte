<svelte:options namespace="svg"/>
<script lang="ts">

  import {downloadTileMap, type TileMap} from '$lib/tms'
  import {debounce} from '$lib/debounce'
  import {type Point} from '$lib/graphics'
  import {epsg3301Tiles} from '$lib/tms/Epsg3301Tiles'

  export let tileMapUrl: string
  export let zoomLevel: number
  export let viewBox: DOMRect
  export let transparent = false

  let tileMap: TileMap
  let level: { href: string; unitsPerPixel: number; order: number }

  let tilesPerAxis: number
  $: download(tileMapUrl)

  function selectZoomLevel(tileMap: TileMap, zoomLevel: number) {
    level = getLevel(+zoomLevel)
  }

  function getLevel(zoomLevel: number) {
    return tileMap.tileSets.find(i => i.order === +zoomLevel)
  }

  async function download(url: string) {
    tileMap = await downloadTileMap(url)
  }

  function getTiles(tilesPerAxis: number, viewBox: DOMRect): Point [] {
    const level = getLevel(zoomLevel)
    if (!level) return []
    return epsg3301Tiles.visibleTilesByClientViewBox(viewBox, level.order).map(([x, y]) => ({
          x: tileMap.tileFormat.width * x,
          y: -tileMap.tileFormat.height * (y + 1),
          href: `${level.href}/${x}/${y}`,
        }),
    )
  }


  let visibleTiles: Map<number, Point[]> = new Map()
  let layers: number[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: tileMap && viewBox && debouncedTileCalculator(viewBox, zoomLevel)


  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    selectZoomLevel(tileMap, zoomLevel)
    tilesPerAxis = Math.pow(2, zoomLevel)
    visibleTiles.set(zoomLevel, getTiles(tilesPerAxis, viewBox))
    visibleTiles = new Map(visibleTiles)
    if (transparent) {
      layers = [zoomLevel]
    } else {
      layers = Array.from(visibleTiles.keys()).filter(l => l <= zoomLevel).sort((a, b) => a - b)
    }
  }

</script>
{#if level && tilesPerAxis}
  <g transform="translate({tileMap.origin.x}, {tileMap.origin.y})">
    {#each layers as level (level)}
      <g transform="scale({getLevel(level).unitsPerPixel},{-(getLevel(level).unitsPerPixel)})">
        {#each visibleTiles.get(level) as tile (tile.href)}
          <image x={Math.floor(tile.x)} y={Math.floor(tile.y)} href={tile.href}/>
        {/each}
      </g>
    {/each}
  </g>
{/if}