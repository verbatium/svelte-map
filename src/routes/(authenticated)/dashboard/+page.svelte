<script lang="ts">
	import type { PageData } from './$types';
	import { type Car, type FeatureConfig, type Region, type Vehicle } from '$lib/tesla/api';

	let meData: string;
	let configData: FeatureConfig;
	let ordersData: Vehicle[];
	let vehiclesData: Car[];
	let regionData: Region;

	export let data: PageData;


	async function meClick() {
		const result = await fetch('/proxy/tesla/api/1/users/me');
		meData = await result.text();
	}

	async function featureConfigClick() {
		const result = await fetch('/proxy/tesla/api/1/users/feature_config');
		configData = await result.json();
	}

	async function ordersClick() {
		const result = await fetch('/proxy/tesla/api/1/users/orders');
		ordersData = await result.json();
	}

	async function regionClick() {
		const result = await fetch('/proxy/tesla/api/1/users/region');
		regionData = await result.json();
	}

	async function vehiclesClick() {
		const result = await fetch('/proxy/tesla/api/1/vehicles');
		vehiclesData = await result.json();
	}

</script>

<section class="prose">
	<h1>Dashboard</h1>
	<p>🎉 Hello there <strong>{data.user?.email}</strong>, you're logged in!</p>
	<div>
		<button on:click={featureConfigClick}>feature_config</button>
		<div>
			{#if configData}
				{JSON.stringify(configData)}
			{/if}
		</div>
	</div>
	<div>
		<button on:click={meClick}>Me</button>
		<div>
			{#if meData}
				{JSON.stringify(meData)}
			{/if}
		</div>
	</div>
	<div>
		<button on:click={ordersClick}>orders</button>
		<div>
			{#if ordersData}
				{JSON.stringify(ordersData)}
			{/if}
		</div>
	</div>
	<div>
		<button on:click={regionClick}>region</button>
		<div>
			{#if regionData}
				{JSON.stringify(regionData)}
			{/if}
		</div>
	</div>
	<div>
		<button on:click={vehiclesClick}>Vehicles</button>
		<div>
			{#if vehiclesData}
				{JSON.stringify(vehiclesData)}
			{/if}
		</div>
	</div>
</section>