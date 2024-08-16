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
