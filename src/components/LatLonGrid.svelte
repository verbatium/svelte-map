<svelte:options namespace="svg"/>
<script lang="ts">
  import {lest97} from '$lib/LambertConformalConic'

  export let viewBox: DOMRect
  $: paths = init(viewBox)

  function init(viewBox: DOMRect): string[] {
    if (!viewBox) return []
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

    let result = []
    let center = lest97.directConversion(0,90)
    console.log(center)


    for (let i = minLatLon[1]; i <= maxLatLon[1]; i++) {
      const p1 = lest97.directConversion(minLatLon[0],i)
      const p2 = lest97.directConversion(maxLatLon[0],i)
      result.push(`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`)
      for (let j = minLatLon[0]; j <= maxLatLon[0]; j++) {
        const l1 = lest97.directConversion(j, i-1)
        const l3 = lest97.directConversion(j, i)
        result.push(`M ${l1[0]} ${l1[1]} L ${l3[0]} ${l3[1]}`)
      }
    }
    return result
  }

</script>


{#each paths as d}
  <path d={d} stroke="{d.includes('A')? 'red': 'green'}" vector-effect="non-scaling-stroke" fill="none"/>
{/each}
