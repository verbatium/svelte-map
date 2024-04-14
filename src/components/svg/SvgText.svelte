<svelte:options namespace="svg"/>
<script lang="ts">
  export let x: number = 0
  export let y: number = 0
  export let cartesian = true
  export let text
  let transform: string = `translate(${x}, ${y})${cartesian ? ' scale(1,-1)' : ''}`
</script>

<text transform="{transform}" x="0" y="0">
  <slot>
    {text}
  </slot>
</text>