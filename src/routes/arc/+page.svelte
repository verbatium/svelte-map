<script lang="ts">

  import {approximateAngle} from './Math.extension'

  let viewBoxString = `0,0,500,500`
  let angle = 90
  let radius = 1
  let ch = ''
  let al = ''

  $: arcD = arc(100, angle)
  $: arcD2 = arc(220, angle)
  $: arcD3 = arc(200, angle) + ' L 0 0 Z'
  $: chordLine = chordLineText(angle)

  $: L = Len(angle, radius)
  $: hordTextHeight = hth(angle)
  $: m = M(angle, radius)
  $: k = L === 0 ? 1 : (m / L)

  $: graph = graphData()

  let approxAngle : number
  let approxRadius : number

  $: recalcChoreArcLengths(radius, angle)
  $: recalcRadiusAngle(L, m)

  function recalcRadiusAngle(l: number, m: number) {
     approxAngle =  approximateAngle(l, m, 0.0001)
    approxRadius = l / approxAngle
  }

  function recalcChoreArcLengths(radius: number, angle: number) {
    L = Len(angle, radius)
    m = M(angle, radius)
  }


  function Len(angle: number, radius: number): number {
    return Math.PI * angle / 180 * radius
  }

  function arc(r: number, a: number): string {
    const halfAngleRad = a / 2 / 180 * Math.PI
    const cosHa = Math.cos(halfAngleRad)
    const sinHa = Math.sin(halfAngleRad)
    return `M ${r * cosHa} ${r * sinHa} A ${r}.0 ${r} 0 ${a > 180 ? 1 : 0}  0 ${r * cosHa} ${-r * sinHa}`
  }

  function graphData(): string {
    const f = []
    for (let i = 1; i < 360; i++) {
      const v = M(i, 1) / Len(i, radius)
      f.push(`L ${i}  ${360 * v}`)
    }
    return `M 0 360 ${f.join(' ')}`
  }

  function chordLineText(a: number): string {
    const r = 200
    const halfAngleRad = a / 2 / 180 * Math.PI
    const cosHa = Math.cos(halfAngleRad)
    const sinHa = Math.sin(halfAngleRad)
    return `M ${r * cosHa} ${r * sinHa} L ${r * cosHa} ${-r * sinHa}`
  }

  function hth(a: number): number {
    const r = 200
    const halfAngleRad = a / 2 / 180 * Math.PI
    const cosHa = Math.cos(halfAngleRad)
    return r * cosHa
  }

  function M(a: number, r: number): number {
    const halfAngleRad = a / 2 / 180 * Math.PI
    const cosHa = Math.sin(halfAngleRad)
    return 2 * r * cosHa
  }


</script>
<div class="grid grid-cols-2">
  <div>
    <label>
      Angle
      <input bind:value={angle} max="360" min="0" type="range"/> ({angle.toFixed(2)})
    </label>

    <label>
      Radius
      <input bind:value={radius} min="0" type="number"/>
    </label>

  </div>
  <div>
    <label>
      ArcLength
      <input bind:value={L} min="0" type="number"/>
    </label>

    <label>
      Chore
      <input bind:value={m} min="0" type="number"/>
    </label>

    <div> approxRadius = { (approxRadius ?? radius).toFixed(2) }</div>
    <div> approx Angle = { (approxAngle ?? angle / Math.PI * 180).toFixed(2) }</div>
    <div> m / L = { L === 0 ? 1 : m / L}</div>
  </div>
  <div>
    <svg class="border border-amber-600 m-20 bg-amber-200" viewBox={viewBoxString}>
      <defs>
        <marker
          id="arrow"
          markerHeight="6"
          markerWidth="6"
          orient="auto-start-reverse"
          refX="1"
          refY="0.5"
          viewBox="0 0 1 1">
          <path d="M 0 1 a 1 1 0 0 0 0 -1 l 1 0.5 Z"
                fill="context-stroke"
                stroke-width="context-stroke-width"/>
        </marker>
        <!-- Dot marker definition -->
        <marker
          id="dot"
          markerHeight="5"
          markerWidth="5"
          refX="5"
          refY="5"
          viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="red" r="5"/>
        </marker>
      </defs>
      <g transform="translate(250,250)">
        <circle fill="none" r="200" stroke="red" stroke-width="1"/>
        <g transform="rotate(-90)">
          <path d={arcD3} fill="#c1eabe" stroke="blue" stroke-width="2"/>
          <line fill="none" stroke="green" stroke-width="2" transform="rotate({- angle/2})"
                x2="230"/>
          <line fill="none" stroke="green" stroke-width="2" transform="rotate({  angle/2})"
                x2="230"/>
          <line fill="none" marker-end='url(#arrow)' stroke="green" stroke-width="2" x2="-200"/>
          <path d={arcD} fill="none" marker-end='url(#arrow)' marker-start='url(#arrow)' stroke="black"
                stroke-width="1"/>
          <path d={arcD2} fill="none" marker-end='url(#arrow)' marker-start='url(#arrow)' stroke="black"
                stroke-width="1"/>
          <path d={chordLine} fill="none" marker-end='url(#arrow)' marker-start='url(#arrow)' stroke="black"
                stroke-width="1"/>
        </g>

        <text text-anchor="middle" y="-50">θ = {angle}</text>


        <text x="5" y="100">r = {radius}</text>
        <text text-anchor="middle" y="-225">L = {L.toFixed(4)}</text>
        <text text-anchor="middle" y="{-hordTextHeight}">m = {m.toFixed(4)}</text>
      </g>
    </svg>
  </div>
  <div>
    <svg class="border border-amber-600 m-20 bg-amber-200" viewBox="0 0 360 360">
      <g transform="scale(1,-1) translate(0,-360)">
        <path d={graph} fill="none" stroke="blue"/>
        <g transform="translate({angle}, {k * 360})">
          <circle fill="none" r="5" stroke="red" stroke-width="2"/>
        </g>
        <text dominant-baseline="middle" transform="scale(1,-1)">
          <tspan text-anchor="middle" x="1rem" y='-2.1rem'>m</tspan>
          <tspan text-anchor="middle" x="1rem" y='-1.5rem'>—</tspan>
          <tspan text-anchor="middle" x="1rem" y='-0.9rem'>L</tspan>
          <tspan x="1.5rem" y="-1.5rem">= {k.toFixed(12)}</tspan>
        </text>
      </g>
    </svg>
  </div>

</div>
<style lang="postcss">
    input {
        @apply border border-amber-900;
    }
</style>