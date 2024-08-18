<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<div>{data.electricity[0].fromDateTime.toLocaleDateString()}</div>
<div class="grid  grid-cols-4 space-y-1">
	<div>From</div>
	<div>to</div>
	<div>cents Per Kwh</div>
	<div>cents Per Kwh with VAT</div>
	{#each data.electricity as row}
		<div>{row.fromDateTime.toLocaleTimeString()}</div>
		<div>{row.toDateTime.toLocaleTimeString()}</div>
		<div>{row.centsPerKwh}</div>
		<div>{row.centsPerKwhWithVat}</div>
	{/each}
</div>
