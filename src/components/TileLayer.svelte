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


  let visibleTiles: Map<number, {x:number,y: number,href: string}[]> = new Map()
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
      <g transform="scale({getLevel(level)?.unitsPerPixel??1},{-(getLevel(level)?.unitsPerPixel??1)})">
        {#each visibleTiles?.get(level) ?? [] as tile (tile.href)}
          <image x="0" y="0" href={tile.href} transform="translate({Math.floor(tile.x)}, {Math.floor(tile.y)})"/>
        {/each}
      </g>
    {/each}
  </g>
{/if}