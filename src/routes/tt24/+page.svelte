<script lang="ts">
  import json from './track.json'
  import type {TipustTopini, Track} from './TipustTopini'
  import Map from '../../components/Map.svelte'
  import {lest97} from '$lib/LambertConformalConic'
  import TileLayer from '../../components/TileLayer.svelte'
  let data = json as unknown as TipustTopini
  data.tracks = data.tracks.reverse()

  let cursor: DOMPoint
  let cursorLL: DOMPoint

  function onCursorMoved(e: CustomEvent<DOMPoint>) {
    cursor = e.detail
    const [x, y] = lest97.inverseConversion(cursor.x, cursor.y)
    cursorLL = new DOMPoint(x, y)
  }

  function getPath(track: Track ): string{

    let converted = track.coordinates
      .map(([b, l]) => lest97.directConversion(l,b))
      .map(c=> `${c[0]} ${c[1]}` )
    return 'M' + converted[0] + ' L' + converted.slice(1).join(',');
  }

</script>

<Map let:viewBox let:zoomLevel on:cursormoved={onCursorMoved}>
  <TileLayer tileMapUrl="https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@LEST" transparent={false} {viewBox} {zoomLevel}/>
  {#each data.tracks as track}
    {@const c=console.log(track.color)}
    <path d={getPath(track)} stroke={track.color} stroke-width={track.width} vector-effect="non-scaling-stroke" fill="none"/>
  {/each}
</Map>