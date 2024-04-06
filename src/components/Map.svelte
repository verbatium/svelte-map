<svelte:options namespace="svg" />

<script>
	import Svg from './Svg.svelte';
	import { onMount } from 'svelte';

	async function getCapabilities() {
		const url =
			'https://teenus.maaamet.ee/ows/ajakohane-haldusjaotus?service=wms&version=1.3.0&request=GetCapabilities';
		let response = await fetch(url);
		console.log(await response.text());
	}

	onMount(() => {
		getCapabilities();
	});
</script>

<Svg class="h-screen w-full">
	<image href="./bg1.png" />
</Svg>
