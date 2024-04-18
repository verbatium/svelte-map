<script lang="ts">
  let baseUrl = 'https://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri'
</script>

<input bind:value={baseUrl} class="w-3/4 border-2 rounded-2xl px-2.5" type="text">
<div>
  <a href="/wms/{btoa(baseUrl)}">{baseUrl}</a>
</div>
