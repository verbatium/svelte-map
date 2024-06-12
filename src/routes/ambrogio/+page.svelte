<script lang="ts">
  import {type Ambrogio, decodeErrorState, decodeState} from './ambrogio'
  import data from './log.json'

  const zeroDate = new Date('2000-01-01T00:00:00.000Z').getTime()

  let json: Ambrogio = data as unknown as Ambrogio

  function ts(timestamp: number): Date {
    return new Date(zeroDate + timestamp * 1000)
  }


</script>

<div>version {json.version}</div>
<div>release {json.release}</div>
<div>program_id {json.program_id}</div>
<div>last data upload time {new Date(json.upload_ts)}</div>

<div>Machine:{json.machine}</div>
<div>Statistics:{json.stats}</div>
<div>cloud:{json.cloud}</div>
<div>devices:
  <div class="grid grid-cols-4 border-2 border-gray-200">
    <div> canId</div>
    <div> revision</div>
    <div> hwRevision</div>
    <div> serial</div>
    {#each json.devices as device}
      <div> {device.canId}</div>
      <div> {device.revision}</div>
      <div> {device.hwRevision}</div>
      <div> {device.serial}</div>
    {/each}
  </div>

</div>
<div>settings:{json.settings}</div>
<div>factory:{json.factory}</div>
<div>robotCfg:{json.robotCfg}</div>
{#if json}
  <div>syslogs:
    <div>Events</div>
    <div class="grid grid-cols-3 border-2 border-gray-200">
      <div>Error Time ntf_code areaIndex state</div>
      <div>stats</div>
      <div>subEvents</div>
      {#each json.syslogs.events as event}
        <div class="border-l-8 border-white-100"
             class:border-red-600={event.error}
        >
          <div>{ts(event.timestamp).toISOString()} ntf_code:{event.ntf_code ?? '?'} areaIndex:{event.areaIndex ?? '?'}
          </div>
          <div>{(event.error ? decodeErrorState : decodeState)(event.state)}
          </div>
        </div>
        <div>signal: {JSON.stringify(event.stats, null, 2)}</div>
        <div>
          {#each event.subEvents ?? [] as subEvent}
            <div>
              {ts(subEvent.timestamp).toISOString()}
              <div>{(event.error ? decodeErrorState : decodeState)(subEvent.state)}</div>
              <div>{JSON.stringify(subEvent)}</div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}