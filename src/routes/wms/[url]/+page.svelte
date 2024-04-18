<script lang="ts">

  import {type Bbox, Wms} from '$lib/Wms'
  import Map from '../../../components/Map.svelte'
  import WmsLayer from '../../../components/WmsLayer.svelte'

  /** @type {import('./$types').PageData} */
  export let data
  let mapFormat = 'image/png'
  let layer
  let srs
  let styles = {}
  let initialViewBox

  $: capabilities = new Wms(data.capabilities)
  $: selectedStyles = layer?.styles.filter(s => styles[s.name]).map(s => s.name).join(',')
  $: srs && srsChanged(srs)

  function srsChanged(srs: Bbox) {
    initialViewBox = new DOMRect(srs.minX, srs.minY, srs.maxX - srs.minX, srs.maxY - srs.minY)
  }


</script>
<div class="grid grid-cols-5 gap-3">
  <div class="text-3xl">
    {capabilities.title}
  </div>
  <div class="col-span-4">
    {capabilities.version} {capabilities.url}
  </div>
  <div class="text-3xl">
    Version
  </div>
  <div class="col-span-4">
    {capabilities.version}
  </div>
  <div class="text-3xl">
    Bounding Box:
  </div>
  <div class="col-span-4">
    {JSON.stringify(capabilities.llBbox)}
  </div>
  <div class="text-3xl">
    Map formats:
  </div>
  <div class="col-span-4 space-x-2">
    {#each capabilities.mapFormats ??[] as value}
      <label class="mt-px inline-block ps-[0.15rem] hover:cursor-pointer ">
        <input type="radio" bind:group={mapFormat} value={value}/>
        {value}
      </label>
    {/each}
  </div>
  <div class="text-3xl">
    Projections:
  </div>
  <div class="col-span-4 grid-rows-subgrid">
    <div class="grid grid-cols-10">
      {#each capabilities.supportedSrs ?? [] as value}
        <div class="">{value}</div>
      {/each}
    </div>

  </div>
  <div class="text-3xl">
    Projection bounding Boxes:
  </div>
  <div class="col-span-4 grid-rows-subgrid">
    {#each capabilities.bboxes ?? [] as value}
      <div>
        <label class="mt-px inline-block ps-[0.15rem] hover:cursor-pointer ">
          <input type="radio" class="mr-2" bind:group={srs} value={value}/>
          {value.srs} [{value.minX}; {value.minY}]-[{value.maxX}; {value.maxY}]
        </label>
      </div>
    {/each}
  </div>
  <div class="text-3xl">
    Layers:
  </div>
  <div class="col-span-4 grid-rows-subgrid">
    {#each capabilities.layers ?? [] as value}
      <div class="pt-2">
        <div class="grid grid-cols-4">
          <div>
            <label class="mt-px inline-block ps-[0.15rem] hover:cursor-pointer ">
              <input type="radio"
                     bind:group={layer} value={value}
                     class="mr-2"
              /><span class="text-2xl">{value.title}</span> [{value.name}]
            </label>
          </div>
          <div class="col-span-3">
            <div class=" flex flex-grow space-x-4">
              <div><label class="space-x-2"><input type="checkbox" checked={value.noSubsets}
                                                   disabled class="mr-2">noSubsets</label></div>
              <div><label class="space-x-2"><input type="checkbox" checked={value.opaque}
                                                   disabled class="mr-2">opaque</label>
              </div>
              <div><label class="space-x-2"><input type="checkbox" checked={value.queryable}
                                                   disabled class="mr-2">queryable</label></div>
            </div>
          </div>
          <div>
            {value.abstract}
          </div>
          <div class="col-span-3">
            {#each value.styles ?? [] as style}
              <div>
                <label><input type="checkbox" class="mr-2" bind:checked={styles[style.name]}>{style.title} [{style.name}
                  ]</label>
                <div class="text-sm text-gray-400">{style.abstract}</div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div>Selected:</div>
  <div class="col-span-4">{mapFormat} {srs?.srs} {layer?.name} {selectedStyles}</div>
</div>

{#if mapFormat && srs && layer && initialViewBox}
  <Map let:viewBox let:zoomLevel initialViewBox={initialViewBox}>
    <WmsLayer {zoomLevel} {viewBox} baseUrl={capabilities.url} srs={srs.srs} layers={layer.name} {mapFormat}
              styles={selectedStyles}/>
  </Map>
{/if}
