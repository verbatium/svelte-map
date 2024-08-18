<script lang="ts">
	import { isoDate, today } from '$lib/date';
	import type { PageData } from './$types';

	export let data: PageData;

</script>
<div>Visits: {data.pageVisits}</div>
<div>{data.startDateTime.toLocaleDateString()}</div>
<div class="grid  grid-cols-2 space-y-1">
	<div>Hour</div>
	<div>cents Per Kwh</div>
	{#each data.prices as row, i }
		<div>{i.toString().padStart(2, '0')}</div>
		<div>{row}</div>
	{/each}
</div>