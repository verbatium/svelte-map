<script lang="ts">
	import type { PageData } from './$types';

	let apiPath = 'GET /api/1/users/me';
	let result = '';
	let vehicle_tag = '{vehicle_tag}';

	export let data: PageData;

	async function send() {
		result = '';
		let method = apiPath.split(' ')[0];
		let path = apiPath.split(' ')[1];

		let url = `/proxy/tesla${path}`;
		const response = await fetch(url, { method });
		let json = await response.json();
		result = JSON.stringify(json, null, 2);
	}

</script>

<section class="prose w-full">
	<h1>Dashboard</h1>
	<p>🎉 Hello there <strong>{data.user?.fullName}</strong>, you're logged in!</p>
	<div>
		<div>Test API</div>
		<div>
			<label>
				Vin:
				<input bind:value={vehicle_tag} class="border-2 rounded w-1/2" type="text">
			</label>
		</div>
		<div class="flex">
			<input bind:value={apiPath} class="border-2 rounded w-1/2" list="api" type="text">
			<datalist id="api">
				<option>GET /api/1/users/me</option>
				<option>GET /api/1/users/region</option>
				<option>GET /api/1/users/orders</option>
				<option>GET /api/1/users/feature_config</option>
				<option>GET /api/1/vehicles</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/drivers</option>
				<option>GET /api/1/dx/vehicles/subscriptions/eligibility?vin={vehicle_tag}</option>
				<option>GET /api/1/dx/vehicles/upgrades/eligibility?vin={vehicle_tag}</option>
				<option>POST /api/1/vehicles/fleet_status</option>
				<option>POST /api/1/vehicles/fleet_telemetry_config</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/fleet_telemetry_config</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/mobile_enabled</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/nearby_charging_sites</option>
				<option>GET /api/1/dx/vehicles/options?vin={vehicle_tag}</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/recent_alerts</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/release_notes</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/service_data</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/invitations</option>
				<option>POST /api/1/vehicles/{vehicle_tag}/invitations</option>
				<option>POST /api/1/invitations/redeem</option>
				<option>POST /api/1/vehicles/{vehicle_tag}/invitations/[id]/revoke</option>
				<option>POST /api/1/vehicles/{vehicle_tag}/signed_command</option>
				<option>GET /api/1/subscriptions</option>
				<option>POST /api/1/subscriptions</option>
				<option>GET /api/1/vehicles/{vehicle_tag}</option>
				<option>GET /api/1/vehicles/{vehicle_tag}/vehicle_data?endpoints=location_data%3Bcharge_state%3Bclimate_state%3Bclosures_state%3Bdrive_state%3Bgui_settings%3Bvehicle_config%3Bvehicle_state</option>
				<option>GET /api/1/vehicle_subscriptions</option>
				<option>POST /api/1/vehicle_subscriptions</option>
				<option>POST /api/1/vehicles/{vehicle_tag}/wake_up</option>
				<option>GET /api/1/dx/warranty/details?vin={vehicle_tag}</option>
			</datalist>
			<button class="border-2 rounded px-3" on:click={send}>Send</button>
		</div>

		<pre class="p-4">{result}</pre>
	</div>
</section>