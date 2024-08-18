<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<div>{data.startDateTime}</div>
<div>Visits: {data.pageVisits}</div>
<div class="grid  grid-cols-2 space-y-1">
	<div>From</div>
	<div>cents Per Kwh</div>
	{#each data.electricity as  row, i }
		<div>{i}</div>
		<div>{row}</div>
	{/each}
</div>