<script lang="ts">
	import { session } from "$lib/stores/session";
</script>

<div class="prose">
	<h3>your advertisement could be here</h3>

	<p class="flex items-center gap-4 mt-12">
		{#if $session.user}
			<a href="/dashboard" class="btn btn-primary">Dashboard</a>
		{/if}
	</p>
</div>