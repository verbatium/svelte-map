<script lang="ts">
  import Map from '../components/Map.svelte'
  import {onMount} from 'svelte'
  import {downloadTileMapService, type TileMapDescription} from '$lib/tms'
  import TileLayer from '../components/TileLayer.svelte'
  import WmsLayer from '../components/WmsLayer.svelte'
  import WmsAnimatedLayer from '../components/WmsAnimatedLayer.svelte'
  import LatLonGrid from '../components/LatLonGrid.svelte'

  let tileMapServices: TileMapDescription[]
  let checkedLayer = []
  let selectedLayers = []
  let showMarine = false
  let showWeather = false

  async function loadServices() {
    tileMapServices = (await downloadTileMapService('https://tiles.maaamet.ee/tm/tms/1.0.0/')).tileMaps.filter(l => l.srs === 'EPSG:3301')
  }

  $: selectedLayers = (tileMapServices ?? []).filter((t, i) => checkedLayer[i])
  onMount(() => loadServices())
</script>
<div class="flex">
  <div class="flex-auto w-full">
    <Map let:viewBox let:zoomLevel>
      {#each selectedLayers as layer }
        <TileLayer tileMapUrl={layer.href} transparent="{layer.title === 'Hübriidkaart'}" {viewBox} {zoomLevel}/>
      {/each}
      <rect fill="none" height="{6660000 - 6360000}" stroke="blue" stroke-width="1" vector-effect="non-scaling-stroke"
            width="{754000-340000}"
            x="340000" y="6360000"/>
      {#if showMarine}
        <WmsLayer viewBox={viewBox} zoomLevel={zoomLevel} transparent={true}/>
      {/if}
      {#if showWeather}
        <WmsAnimatedLayer viewBox={viewBox} zoomLevel={zoomLevel} transparent={true}/>
      {/if}
      <g transform="translate(545740,6587104)">
        <circle cx="0" cy="0" r="10" stroke-width="2" vector-effect="non-scaling-stroke" fill="none" stroke="red"/>
      </g>
      <LatLonGrid {viewBox}/>
    </Map>
  </div>
  <div class="flex-none w-1/4">
    {#each tileMapServices ?? [] as service, index}
      <div>
        <label>
          <input type="checkbox" checkbox bind:checked={checkedLayer[index]}/>
          {service.title}
        </label>
      </div>
    {/each}
    <div>
      <label>
        <input bind:checked={showMarine} checkbox type="checkbox"/>
        Marine map
      </label>
    </div>
<div>
  <label>
    <input bind:checked={showWeather} checkbox type="checkbox"/>
    Weather
  </label>
</div>

  </div>

</div>

<style lang="postcss">
    :global(html) {
        background-color: theme('colors.gray.100');
    }
</style>
