<script lang="ts">
  import SvgCartesian from '../../components/svg/SvgCartesian.svelte'
  import SvgText from '../../components/svg/SvgText.svelte'

  let viewBox = {x: -100, y: -100, width: 500, height: 500} as DOMRect
  let cursor: DOMPoint
</script>

<div class="border border-indigo-600">
  <div>
    x: {cursor?.x} y: {cursor?.y}
  </div>
  <SvgCartesian class="border border-amber-600 m-20 bg-amber-200"
                on:cursor={(e)=>{cursor = e.detail}}
                on:viewboxchanged={(e)=>console.log('viewboxchanged', e.detail)}
                {viewBox}
                width="50%"
  >
    {#each {length: 10} as _, i}
      <line x1="0" y1="0" x2="1500" y2="0" transform="translate(0, {i * 100})" stroke="blue"/>
      <SvgText y="{i * 100}" text="{i * 100}"/>

      <line y1="0" x1="0" y2="1500" x2="0" transform="translate({i * 100}, 0)" stroke="green"/>

      <SvgText x="{i * 100}" text="{i * 100}"/>
    {/each}
    <rect fill="none" height="100" stroke="red" width="100" x="100" y="100"/>
  </SvgCartesian>
</div>
