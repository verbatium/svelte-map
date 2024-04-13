<script lang="ts">
  import {panZoom} from '../../components/PanZoom'

  let x = -125
  let y = -130
  let width = 500
  let height = 500
  let cursor: DOMPoint
</script>

<div class="border border-indigo-600">
  <div>
    x: {cursor?.x} y: {cursor?.y}
  </div>
  <svg class="border border-amber-600 m-20 bg-amber-200"
       on:cursor={(e)=>{cursor = e.detail}}
       use:panZoom
       viewBox="{x},{y},{width},{height}"
       width="50%"
       cursor="crosshair"
  >
    <g transform="scale(1,-1) translate(0,-{height + y * 2})">
      {#each {length: 10} as _, i}
        <line x1="0" y1="0" x2="1500" y2="0" transform="translate(0, {i * 100})" stroke="blue"/>
        <text x="0" y="0" transform="translate(0, {i * 100}) scale(1,-1)">{i * 100}</text>
        <line y1="0" x1="0" y2="1500" x2="0" transform="translate({i * 100}, 0)" stroke="green"/>
        <text y="0" x="0" transform="translate({i * 100}, 0) scale(1,-1)">{i * 100}</text>
      {/each}
      <rect fill="none" height="100" stroke="red" width="100" x="100" y="100"/>
    </g>
  </svg>
</div>
