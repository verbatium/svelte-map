<script lang="ts">
  import Map from '../../components/Map.svelte'
  import {onMount} from 'svelte'
  import {downloadTileMapService, type TileMapDescription} from '$lib/tms'
  import TileLayer from '../../components/TileLayer.svelte'
  import WmsLayer from '../../components/WmsLayer.svelte'
  import WmsAnimatedLayer from '../../components/WmsAnimatedLayer.svelte'
  import LatLonGrid from '../../components/LatLonGrid.svelte'
  import LatRuller from '../../components/LatRuller.svelte'
  import {lest97} from '$lib/LambertConformalConic'
  import Image from '../../components/svg/Image.svelte'

  let tileMapServices: TileMapDescription[]
  let checkedLayer: boolean[] = []
  let selectedLayers: TileMapDescription[] = []
  let showMarine = false
  let showWeather = false
  let cursor: DOMPoint
  let cursorLL: DOMPoint
  let userPosition: DOMPoint
  let userHeading = 0

  function receivedNewHeading(e: DeviceOrientationEvent) {
    e.webkitCompassHeading && (userHeading = e.webkitCompassHeading)
  }

  async function loadServices() {
    try {
      let permission = await DeviceOrientationEvent.requestPermission()
      console.log('permission is', permission)
    } catch (e) {
      console.log(e)
    }
    tileMapServices = (await downloadTileMapService('https://tiles.maaamet.ee/tm/tms/1.0.0/')).tileMaps.filter(l => l.srs === 'EPSG:3301')
  }

  $: selectedLayers = (tileMapServices ?? []).filter((t, i) => checkedLayer[i])

  function onCursorMoved(e: CustomEvent<DOMPoint>) {
    cursor = e.detail
    const [x, y] = lest97.inverseConversion(cursor.x, cursor.y)
    cursorLL = new DOMPoint(x, y)
  }

  onMount(() => {

    loadServices()
    const watchID = navigator.geolocation.watchPosition((position: GeolocationPosition): void => {
      const [x, y] = lest97.directConversion(position.coords.latitude, position.coords.longitude)
      userPosition = new DOMPoint(x, y)
    }, (error) => {
      alert(`ERROR(${error.code}): ${error.message}`)
    }, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 30000,
    })
    return () => navigator.geolocation.clearWatch(watchID)
  })
</script>
<svelte:window on:deviceorientation={receivedNewHeading}/>
<div class="flex">
  <div class="flex-auto w-full">
    <div class="fixed bg-amber-50 top-2 left-2 border border-1 border-amber-900 w-1/4 pl-1 grid grid-cols-2">
      <div>X:{cursor?.x.toFixed(2)} </div>
      <div>Y:{cursor?.y.toFixed(2)} </div>
      <div>B:{cursorLL?.x.toFixed(8)} </div>
      <div>L:{cursorLL?.y.toFixed(8)} </div>
      <div>Heading: {userHeading}</div>
      <div>Zoom: ????</div>
    </div>
    <Map let:viewBox let:zoomLevel on:cursormoved={onCursorMoved}>
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
      <g transform="translate({userPosition?.x ?? 0},{userPosition?.y?? 0})">
        <circle cx="0" cy="0" fill="none" r="10" stroke="red" stroke-width="2" vector-effect="non-scaling-stroke"/>
      </g>
      {#if userPosition}
        <Image position={userPosition} height={2.129} width={4.75} url="./tesla-model-y.png" heading={userHeading}/>
      {/if}
      <LatLonGrid {viewBox}/>
      <LatRuller {viewBox}/>
    </Map>
  </div>
  <div class="flex-none w-1/4">
    {#each tileMapServices ?? [] as service, index}
      <div>
        <label>
          <input type="checkbox" bind:checked={checkedLayer[index]}/>
          {service.title}
        </label>
      </div>
    {/each}
    <div>
      <label>
        <input bind:checked={showMarine} type="checkbox"/>
        Marine map
      </label>
    </div>
    <div>
      <label>
        <input bind:checked={showWeather} type="checkbox"/>
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
