<svelte:options namespace="svg"/>
<script lang="ts">
  import {lest97} from '$lib/LambertConformalConic'

  export let viewBox: DOMRect
  let g: SVGGElement
  $: paths = init(viewBox, g)

  function init(viewBox: DOMRect, g: SVGGElement): { d: string[], clip: string, hole: string } {
    if (!viewBox || !g) return {d: [], clip: 'M 0 0', hole: ''}
    let p = []
    p[0] = {x: viewBox.x, y: viewBox.y}
    p[1] = {x: viewBox.x + viewBox.width, y: viewBox.y}
    p[2] = {x: viewBox.x, y: viewBox.y + viewBox.height}
    p[3] = {x: viewBox.x + viewBox.width, y: viewBox.y + viewBox.height}

    let pt = p.map(({x, y}) => {
      return lest97.inverseConversion(x, y)
    })
    const minLatLon = pt.map(pp => pp.map(Math.floor)).reduce((a, v) => [a[0] ? Math.min(a[0], v[0]) : v[0], a[1] ? Math.min(a[1], v[1]) : v[1]], [])
    const maxLatLon = pt.map(pp => pp.map(Math.ceil)).reduce((a, v) => [a[0] ? Math.max(a[0], v[0]) : v[0], a[1] ? Math.max(a[1], v[1]) : v[1]], [])

    let d = []

    const pp2 = new DOMPoint(10, 0).matrixTransform(g.getCTM()?.inverse() ?? undefined)
    let delta = pp2.x - viewBox.x

    const clip = `M ${viewBox.x} ${viewBox.y} v${viewBox.height} h${viewBox.width} v${-(viewBox.height)} Z
     m${delta} ${delta}  h${viewBox.width - 2 * delta} v${viewBox.height - 2 * delta}  h${-(viewBox.width - 2 * delta)} Z`
    const hole = ''
    for (let j = minLatLon[0]; j <= maxLatLon[0]; j++) {
      const p1 = lest97.directConversion(minLatLon[0], minLatLon[1])
      let path = [`M ${p1[0]} ${p1[1]}`]
      for (let i = minLatLon[1]; i <= maxLatLon[1]; i++) {
        const l3 = lest97.directConversion(j, i)
        path.push(`L ${l3[0]} ${l3[1]}`)
      }
      d.push(path.join(' '))
    }

    for (let i = minLatLon[1]; i <= maxLatLon[1]; i++) {
      const p1 = lest97.directConversion(minLatLon[0], i)
      const p2 = lest97.directConversion(maxLatLon[0], i)
      d.push(`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`)
    }

    return {d, clip, hole}
  }
</script>

<g bind:this={g}>
  <clipPath id="myClip">
    <path d={paths.clip} fill="black"/>
  </clipPath>
  <g clip-path="url(#myClip)">
    <path d="{paths.clip}" fill="white" stroke="black" stroke-width="4" vector-effect="non-scaling-stroke"/>
    {#each paths.d as d}
      <path d={d} stroke="{'black'}" vector-effect="non-scaling-stroke" fill="none" stroke-width="4"/>
    {/each}
  </g>
</g>
