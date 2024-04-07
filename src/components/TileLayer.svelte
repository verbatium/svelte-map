<svelte:options namespace="svg"/>
<script lang="ts">

  import {downloadTileMap, type TileMap} from '$lib/tms'
  import {debounce} from '$lib/debounce'
  import {limitPointToRange, ceilPoint, floorPoint} from '$lib/graphics'

  export let tileMapUrl: string
  export let zoomLevel: number
  export let viewBox: DOMRect

  let tileMap: TileMap
  let level: { href: string; unitsPerPixel: number; order: number }

  let tilesPerAxis: number
  $: download(tileMapUrl)

  function selectZoomLevel(tileMap: TileMap, zoomLevel: number) {
    level = tileMap.tileSets.find(i => i.order === +zoomLevel)
  }

  async function download(url: string) {
    tileMap = await downloadTileMap(url)
  }

  function getTiles(tilesPerAxis: number, viewBox: DOMRect): { x: number, y: number } [] {
    const m = new DOMMatrix()
      .translate(tileMap.origin.x, tileMap.origin.y)
      .scale(tileMap.tileFormat.width, tileMap.tileFormat.height)
      .scale(level.unitsPerPixel, level.unitsPerPixel)
      .inverse()

    let start = limitPointToRange(floorPoint(m.transformPoint(new DOMPoint(viewBox.x, viewBox.y))), 0, tilesPerAxis)
    let end = limitPointToRange(ceilPoint(m.transformPoint(new DOMPoint(viewBox.x + viewBox.width, viewBox.y + viewBox.height))), 0, tilesPerAxis)

    let xTilesCount = end.x - start.x
    let yTilesCount = end.y - start.y

    return [...Array(xTilesCount).keys()].map(tileX => {
      return [...Array(yTilesCount).keys()].map(tileY => {
        let x = Math.floor(start.x) + tileX
        let y = Math.floor(start.y) + tileY
        return ({
          x: tileMap.tileFormat.width * x,
          y: -tileMap.tileFormat.height *  (y +1),
          href: `${level.href}/${x}/${y}`,
        })
      })
    }).flat()
  }


  let visibleTiles: { x: number, y: number }[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: tileMap && viewBox && debouncedTileCalculator(viewBox, zoomLevel)


  function calculateTiles(viewBox: DOMRect, zoomLevel: number) {
    selectZoomLevel(tileMap, zoomLevel)
    tilesPerAxis = Math.pow(2, zoomLevel)
    visibleTiles = getTiles(tilesPerAxis, viewBox)
  }

</script>
{#if level && tilesPerAxis}
  <g transform="translate({tileMap.origin.x}, {tileMap.origin.y})">
    <g transform="scale({level.unitsPerPixel},{-level.unitsPerPixel})">
      {#each visibleTiles as tile (tile.href)}
        <image x={tile.x} y={tile.y} href={tile.href}/>
      {/each}
    </g>
  </g>
{/if}