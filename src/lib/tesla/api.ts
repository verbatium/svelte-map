const BASE_URL = 'https://fleet-api.prd.eu.vn.cloud.tesla.com';

function options(method: string, token: string) {
	return {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	};
}

export async function httpGet(path: string, token: string) {
	let response = await fetch(`${BASE_URL}${path}`, options('GET', token));
	return await response.json();
}

async function get1<T>(token: string, path: string): Promise<T> {
	const info = (await httpGet(path, token)) as unknown as Response<T>;
	return info.response;
}

async function getArray<T>(token: string, path: string): Promise<ResponseArray<T>> {
	const response = await fetch(`${BASE_URL}${path}`, options('GET', token));
	return (await response.json()) as unknown as ResponseArray<T>;
}

async function getPage<T>(token: string, path: string): Promise<PagedResponse<T>> {
	const response = await fetch(`${BASE_URL}${path}`, options('GET', token));
	return (await response.json()) as unknown as PagedResponse<T>;
}

export async function orders(token: string): Promise<Vehicle[]> {
	let responseArray = await getArray<Vehicle>(token, '/api/1/users/orders');
	return responseArray.response;
}

export async function featureConfig(token: string): Promise<FeatureConfig> {
	return await get1(token, '/api/1/users/feature_config');
}

export async function me(token: string): Promise<UserDetails> {
	return await get1(token, '/api/1/users/me');
}

export async function region(token: string): Promise<Region> {
	return await get1(token, '/api/1/users/region');
}

export async function vehicles(token: string) {
	let pagedResponse = await getPage(token, '/api/1/vehicles');
	return pagedResponse.response;
}

export interface FeatureConfig {
	signaling: {
		enabled: true;
		subscribe_connectivity: false;
		use_auth_token: false;
	};
}

export interface Region {
	region: string;
	fleet_api_base_url: string;
}

export interface Vehicle {
	vehicleMapId: number;
	referenceNumber: string;
	vin: string;
	orderStatus: string;
	orderSubstatus: string;
	modelCode: string;
	countryCode: string;
	locale: string;
	mktOptions: string;
	isB2b: boolean;
}

export interface UserDetails {
	email: string;
	full_name: string;
	profile_image_url: string;
	vault_uuid: string;
}

interface ResponseArray<T> extends Response<T[]> {
	count: number;
}

interface Response<T> {
	response: T;
}

export interface Car {
	id: number;
	vehicle_id: number;
	vin: string;
	color: string;
	access_type: string;
	display_name: string;
	option_codes: string;
	granular_access: {
		hide_private: boolean;
	};
	tokens: string[];
	state: string;
	in_service: boolean;
	id_s: string;
	calendar_enabled: boolean;
	api_version: string;
	backseat_token: string;
	backseat_token_updated_at: string;
}

interface PagedResponse<T> extends ResponseArray<T> {
	pagination: {
		previous: null;
		next: null;
		current: 1;
		per_page: 2;
		count: 2;
		pages: 1;
	};
}

interface VehicleData {
	id: number;
	user_id: number;
	vehicle_id: number;
	vin: string;
	color: string;
	access_type: string;
	granular_access: {
		hide_private: boolean;
	};
	tokens: string;
	state: string;
	in_service: boolean;
	id_s: string;
	calendar_enabled: boolean;
	api_version: number;
	backseat_token: string;
	backseat_token_updated_at: string;
	ble_autopair_enrolled: boolean;
	charge_schedule_data: VehicleConfig;
	charge_state: ChargeState;
	climate_state: ClimateState;
	drive_state: {
		gps_as_of: number;
		heading: number;
		latitude: number;
		longitude: number;
		native_latitude: number;
		native_location_supported: number;
		native_longitude: number;
		native_type: string;
		power: number;
		shift_state: string;
		speed: number;
		timestamp: number;
	};
	gui_settings: {
		gui_24_hour_time: boolean;
		gui_charge_rate_units: string;
		gui_distance_units: string;
		gui_range_display: string;
		gui_temperature_units: string;
		gui_tirepressure_units: string;
		show_range_units: boolean;
		timestamp: number;
	};
	parked_accessory: VehicleConfig;
	preconditioning_schedule_data: VehicleConfig;
	vehicle_config: VehicleConfig;
	vehicle_state: {
		api_version: number;
		autopark_state_v2: string;
		calendar_supported: boolean;
		car_version: string;
		center_display_state: number;
		dashcam_clip_save_available: boolean;
		dashcam_state: string;
		df: number;
		dr: number;
		fd_window: number;
		feature_bitmask: string;
		fp_window: number;
		ft: number;
		is_user_present: boolean;
		locked: boolean;
		media_info: {
			a2dp_source_name: string;
			audio_volume: number;
			audio_volume_increment: number;
			audio_volume_max: number;
			media_playback_status: string;
			now_playing_album: string;
			now_playing_artist: string;
			now_playing_duration: number;
			now_playing_elapsed: number;
			now_playing_source: string;
			now_playing_station: string;
			now_playing_title: string;
		};
		media_state: {
			remote_control_enabled: boolean;
		};
		notifications_supported: boolean;
		odometer: number;
		parsed_calendar_supported: boolean;
		pf: number;
		pr: number;
		rd_window: number;
		remote_start: boolean;
		remote_start_enabled: boolean;
		remote_start_supported: boolean;
		rp_window: number;
		rt: number;
		santa_mode: number;
		sentry_mode: boolean;
		sentry_mode_available: boolean;
		service_mode: boolean;
		service_mode_plus: boolean;
		software_update: {
			download_perc: number;
			expected_duration_sec: number;
			install_perc: number;
			status: string;
			version: string;
		};
		speed_limit_mode: {
			active: boolean;
			current_limit_mph: number;
			max_limit_mph: number;
			min_limit_mph: number;
			pin_code_set: boolean;
		};
		timestamp: number;
		tpms_hard_warning_fl: boolean;
		tpms_hard_warning_fr: boolean;
		tpms_hard_warning_rl: boolean;
		tpms_hard_warning_rr: boolean;
		tpms_last_seen_pressure_time_fl: number;
		tpms_last_seen_pressure_time_fr: number;
		tpms_last_seen_pressure_time_rl: number;
		tpms_last_seen_pressure_time_rr: number;
		tpms_pressure_fl: number;
		tpms_pressure_fr: number;
		tpms_pressure_rl: number;
		tpms_pressure_rr: number;
		tpms_rcp_front_value: number;
		tpms_rcp_rear_value: number;
		tpms_soft_warning_fl: boolean;
		tpms_soft_warning_fr: boolean;
		tpms_soft_warning_rl: boolean;
		tpms_soft_warning_rr: boolean;
		valet_mode: boolean;
		valet_pin_needed: boolean;
		vehicle_name: string;
		vehicle_self_test_progress: number;
		vehicle_self_test_requested: boolean;
		webcam_available: boolean;
	};
}

interface ClimateState {
	allow_cabin_overheat_protection: boolean;
	auto_seat_climate_left: boolean;
	auto_seat_climate_right: boolean;
	auto_steering_wheel_heat: boolean;
	battery_heater: boolean;
	battery_heater_no_power: boolean;
	bioweapon_mode: boolean;
	cabin_overheat_protection: string;
	cabin_overheat_protection_actively_cooling: boolean;
	climate_keeper_mode: string;
	cop_activation_temperature: string;
	defrost_mode: number;
	driver_temp_setting: number;
	fan_status: number;
	hvac_auto_request: string;
	inside_temp: boolean;
	is_auto_conditioning_on: boolean;
	is_climate_on: boolean;
	is_front_defroster_on: boolean;
	is_preconditioning: boolean;
	is_rear_defroster_on: boolean;
	left_temp_direction: number;
	max_avail_temp: number;
	min_avail_temp: number;
	outside_temp: number;
	passenger_temp_setting: number;
	remote_heater_control_enabled: boolean;
	right_temp_direction: number;
	seat_heater_left: number;
	seat_heater_rear_center: number;
	seat_heater_rear_left: number;
	seat_heater_rear_right: number;
	seat_heater_right: number;
	side_mirror_heaters: boolean;
	steering_wheel_heat_level: number;
	steering_wheel_heater: boolean;
	supports_fan_only_cabin_overheat_protection: boolean;
	timestamp: number;
	wiper_blade_heater: boolean;
}

interface ChargeState {
	battery_heater_on: boolean;
	battery_level: number;
	battery_range: number;
	charge_amps: number;
	charge_current_request: number;
	charge_current_request_max: number;
	charge_enable_request: boolean;
	charge_energy_added: number;
	charge_limit_soc: number;
	charge_limit_soc_max: number;
	charge_limit_soc_min: number;
	charge_limit_soc_std: number;
	charge_miles_added_ideal: number;
	charge_miles_added_rated: number;
	charge_port_cold_weather_mode: boolean;
	charge_port_color: string;
	charge_port_door_open: boolean;
	charge_port_latch: string;
	charge_rate: number;
	charger_actual_current: number;
	charger_phases: number;
	charger_pilot_current: number;
	charger_power: number;
	charger_voltage: number;
	charging_state: string;
	conn_charge_cable: string;
	est_battery_range: number;
	fast_charger_brand: string;
	fast_charger_present: boolean;
	fast_charger_type: string;
	ideal_battery_range: number;
	max_range_charge_counter: number;
	minutes_to_full_charge: number;
	not_enough_power_to_heat: boolean;
	off_peak_charging_enabled: boolean;
	off_peak_charging_times: string;
	preconditioning_enabled: boolean;
	preconditioning_times: string;
	scheduled_charging_mode: string;
	scheduled_charging_pending: boolean;
	scheduled_charging_start_time: string;
	scheduled_departure_time: string;
	supercharger_session_trip_planner: boolean;
	time_to_full_charge: number;
	timestamp: number;
	trip_charging: boolean;
	usable_battery_level: number;
	user_charge_enable_request: string;
}

interface VehicleConfig {
	aux_park_lamps: string;
	badge_version: number;
	can_accept_navigation_requests: boolean;
	can_actuate_trunks: boolean;
	car_special_type: string;
	car_type: string;
	charge_port_type: string;
	cop_user_set_temp_supported: boolean;
	dashcam_clip_save_supported: boolean;
	default_charge_to_max: boolean;
	driver_assist: string;
	ece_restrictions: boolean;
	efficiency_package: string;
	eu_vehicle: boolean;
	exterior_color: string;
	exterior_trim: string;
	exterior_trim_override: string;
	has_air_suspension: boolean;
	has_ludicrous_mode: boolean;
	has_seat_cooling: boolean;
	headlamp_type: string;
	interior_trim_type: string;
	key_version: number;
	motorized_charge_port: boolean;
	paint_color_override: string;
	performance_package: string;
	plg: boolean;
	pws: boolean;
	rear_drive_unit: string;
	rear_seat_heaters: number;
	rear_seat_type: number;
	rhd: boolean;
	roof_color: string;
	seat_type: string;
	sentry_preview_supported: boolean;
	spoiler_type: string;
	sun_roof_installed: boolean;
	supports_qr_pairing: boolean;
	third_row_seats: string;
	timestamp: number;
	trim_badging: string;
	use_range_badging: boolean;
	utc_offset: number;
	webcam_selfie_supported: boolean;
	webcam_supported: boolean;
	wheel_type: string;
}
