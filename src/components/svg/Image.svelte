<svelte:options namespace="svg"/>
<script lang="ts">
  export let url: string
  export let position: DOMPoint
  export let width: number
  export let height: number

</script>
<g transform="translate({position.x - width/2},{position.y - height/2})">
  <image {width} {height} xlink:href={url}/>
</g>
