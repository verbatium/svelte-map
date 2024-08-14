<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="prose">
	<h1>Dashboard</h1>
	<p>🎉 Hello there <strong>{data.user?.email}</strong>, you're logged in!</p>
</section>