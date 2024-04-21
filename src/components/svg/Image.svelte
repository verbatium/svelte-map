<svelte:options namespace="svg"/>
<script lang="ts">
  import SvgText from './SvgText.svelte'

  export let url: string
  export let position: DOMPoint
  export let width: number
  export let height: number
  export let heading: number = 0

</script>
<g transform="translate({position.x - width/2},{position.y - height/2}) rotate({90+heading})" >
  <image {width} {height} xlink:href={url}/>
</g>
