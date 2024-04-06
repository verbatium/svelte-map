<script lang="ts">

  import {downloadTileMap, type TileMap} from '$lib/tms'

  export let tileMapUrl: string
  export let zoomLevel: number
  let tileMap: TileMap
  let level: { href: string; unitsPerPixel: number; order: number }

  let tilesPerAxis: number
  $: download(tileMapUrl)
  $: tileMap && zoomLevel !== undefined && selectZoomLevel(tileMap, zoomLevel)
  $: tilesPerAxis = Math.pow(2, zoomLevel)

  //<BoundingBox minx="365000.000000" miny="6375000.000000" maxx="740000.000000" maxy="6635000.000000"/>
  //<Origin x="40500.000000" y="5993000.000000"/>
  //<TileFormat width="256" height="256" mime-type="image/png" extension="png"/>
  //<TileSet href="https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST/0" units-per-pixel="4000.00000000000000000000" order="0"/>

  function selectZoomLevel(tileMap: TileMap, zoomLevel: number) {
    level = tileMap.tileSets.find(i => i.order === +zoomLevel)
  }

  async function download(url: string) {
    tileMap = await downloadTileMap(url)
  }

</script>
<text y="1rem">level: {JSON.stringify(level)} </text>
<text y="2rem">zoomLevel: {zoomLevel} </text>
<text y="3rem">tilesPerAxis: {tilesPerAxis} </text>
{#if level && tilesPerAxis}
  <g transform="translate({tileMap.origin.x}, {tileMap.origin.y})">
    <g transform="scale({level.unitsPerPixel},{-level.unitsPerPixel})">
      {#each [...Array(tilesPerAxis).keys()] as x}
        {#each [...Array(tilesPerAxis).keys()] as y}
          <image x={ 256.0 * x} y={256.0 *  (-y -1)} href={`${level.href}/${x}/${y}`} transform="scale(1,1)"/>
        {/each}
      {/each}
    </g>
  </g>
{/if}