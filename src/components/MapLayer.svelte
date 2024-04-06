<script lang="ts">

  import {downloadTileMap, type TileMap} from '$lib/tms'
  import {debounce} from '$lib/debounce'

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
    const startX = (viewBox.x - tileMap.origin.x) / tileMap.tileFormat.width / level.unitsPerPixel - 1
    const startY = (viewBox.y - tileMap.origin.y) / tileMap.tileFormat.height / level.unitsPerPixel - 1
    const endX = Math.min(startX + viewBox.width / tileMap.tileFormat.width / level.unitsPerPixel + 2, tilesPerAxis)
    const endY = Math.min(startY + viewBox.height / tileMap.tileFormat.height / level.unitsPerPixel + 2, tilesPerAxis)
    let xTilesCount = Math.ceil(endX) - Math.floor(startX)
    let yTilesCount = Math.ceil(endY) - Math.floor(startY)

    return [...Array(xTilesCount).keys()].map(x => {
      return [...Array(yTilesCount).keys()].map(y => ({
        z: level.order,
        x: Math.floor(startX) + x,
        y: Math.floor(startY) + y,
      }))
    }).flat()
  }


  let visibleTiles: { x: number, y: number }[] = []

  const debouncedTileCalculator = debounce(calculateTiles, 20)
  $: tileMap && zoomLevel !== undefined && viewBox && debouncedTileCalculator(viewBox, zoomLevel)


  function calculateTiles(viewBox: DOMRect) {
    tileMap && zoomLevel !== undefined && selectZoomLevel(tileMap, zoomLevel)
    tilesPerAxis = Math.pow(2, zoomLevel)
    if (tileMap && viewBox && tilesPerAxis) {
      visibleTiles = [...visibleTiles.filter(t => t.z === zoomLevel), ...getTiles(tilesPerAxis, viewBox)]
    }
    console.log(visibleTiles)
  }

</script>
{#if level && tilesPerAxis}
  <g transform="translate({tileMap.origin.x}, {tileMap.origin.y})">
    <g transform="scale({level.unitsPerPixel},{-level.unitsPerPixel})">
      {#each visibleTiles as tile (`${tile.z}/${tile.x}/${tile.y}`)}
        <image x={ tileMap.tileFormat.width * tile.x} y={-tileMap.tileFormat.height *  (tile.y +1)}
               href={`${level.href}/${tile.x}/${tile.y}`} transform="scale(1,1)"/>
      {/each}
    </g>
  </g>
{/if}