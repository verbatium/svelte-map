<svelte:options namespace="svg"/>
<script lang="ts">
  export let url: string
  export let position: DOMPoint
  export let width: number
  export let height: number
  export let heading: number = 0

</script>
<g transform="translate({position.x},{position.y}) rotate({90+heading}) translate({-width/2},{-height/2})">
  <image {width} {height} xlink:href={url}/>
</g>
