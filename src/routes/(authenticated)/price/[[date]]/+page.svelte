<script lang="ts">
	import { isoDate, nextDay, prviousDay } from '$lib/date';
	import type { PageData } from './$types';

	export let data: PageData;
	$: prev = prviousDay(data.startDateTime);
	$: next = nextDay(data.startDateTime);

	function path(date: Date) {
		return '/price/' + isoDate(date)
	}

</script>
<div>Visits: {data.pageVisits}</div>
<div class="flex space-x-3">
	<a href={path(prev)}>{prev.toLocaleDateString()}</a>
	<div>{data.startDateTime.toLocaleDateString()}</div>
	<a href="{path(next)}">{next.toLocaleDateString()}</a>
</div>
<div class="grid  grid-cols-2 space-y-1">
	<div>Hour</div>
	<div>cents Per Kwh</div>
	{#each data.prices as row, i }
		<div>{i.toString().padStart(2, '0')}</div>
		<div>{row}</div>
	{/each}
</div>