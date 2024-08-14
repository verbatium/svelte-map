<script lang="ts">
	import type { LayoutData } from "./$types";
	import { page } from "$app/stores";
	import Footer from "./Footer.svelte";
	import Header from "./Header.svelte";
	import { session } from "$lib/stores/session";
	import '../app.css';

	export let data: LayoutData;

	$: title = $page.data?.title ? $page.data.title + " | " : "";

	$: $session.user = data.user;

</script>

<svelte:head>
	<title>{title}Smart Charger</title>
</svelte:head>

<Header />

<main class="max-w-screen-sm mx-auto my-20 px-6">
	<slot />
</main>

<Footer />