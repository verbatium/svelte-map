import { TESLA_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_TESLA_CLIENT_ID } from '$env/static/public';

const audience = 'https://fleet-api.prd.eu.vn.cloud.tesla.com';
const TESLA_OAUTH_URL = 'https://auth.tesla.com/oauth2/v3';

export const authenticationCookieName = 'auth_token';

interface TokenResponse {
	access_token: string; //The token that is used to call the UserInfo endpoint.
	refresh_token: string;
	id_token: string; //The ID token that the app requested. You can use the ID token to verify the user's identity and begin a session with the user. You'll find more details about ID tokens and their contents in the ID token reference.
	expires_in: number;
	state: string; //If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical.
	token_type: string;
}

interface UserDetails {
	email: string;
	full_name: string;
	profile_image_url: string;
	vault_uuid: string;
}

interface Info {
	response: UserDetails;
}

export async function partnerAuthenticationToken(): Promise<string> {
	const response = await fetch(TESLA_OAUTH_URL + '/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: PUBLIC_TESLA_CLIENT_ID,
			client_secret: TESLA_CLIENT_SECRET,
			audience: audience,
			scope: 'openid user_data vehicle_device_data vehicle_cmds vehicle_charging_cmds'
		})
	});
	return await response.text();
}

export function loginRedirectUrl(value: string): URL {
	const url = new URL(TESLA_OAUTH_URL + '/authorize');
	url.searchParams.set('client_id', PUBLIC_TESLA_CLIENT_ID);
	url.searchParams.set('locale', 'en-US');
	url.searchParams.set('prompt', 'login');
	url.searchParams.set('redirect_uri', value);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set(
		'scope',
		'openid user_data vehicle_device_data vehicle_cmds vehicle_charging_cmds'
	);
	url.searchParams.set('state', (Math.floor(Math.random() * 100000) + 1).toString());
	url.searchParams.set('nonce', (Math.floor(Math.random() * 100000) + 1).toString());
	return url;
}

export async function exchangeCodeForToken(
	state: string,
	code: string,
	issuer: string,
	redirectUri: string
): Promise<TokenResponse> {
	if (validateCodeAndStat(state, code, issuer)) {
		const params = new URLSearchParams();
		params.set('grant_type', 'authorization_code');
		params.set('code', code);
		params.set('client_id', PUBLIC_TESLA_CLIENT_ID);
		params.set('client_secret', TESLA_CLIENT_SECRET);
		params.set('audience', audience);
		params.set('redirect_uri', redirectUri);
		params.set('scope', 'openid user_data vehicle_device_data vehicle_cmds vehicle_charging_cmds');

		const response = await fetch(issuer + '/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params.toString()
		});
		if (response.status === 200) {
			return ((await response.json()) || {}) as TokenResponse;
		} else {
			const errorText = await response.text();
			throw new Error(errorText);
		}
	} else {
		return {} as TokenResponse;
	}
}

export async function userInfo(token: string) {
	const BASE_URL = 'https://fleet-api.prd.eu.vn.cloud.tesla.com';

	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	};

	const response = await fetch(`${BASE_URL}/api/1/users/me`, options);
	const me = (await response.json()) as unknown as Info;
	return me.response;
}

function validateCodeAndStat(state: string, code: string, issuer: string): boolean {
	//add logic which will prevent calling exchangeCodeForToken twice
	return state !== code && issuer === issuer;
}
