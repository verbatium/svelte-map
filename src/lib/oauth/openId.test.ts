import { describe, it } from 'vitest';

interface OpenIdConfig {
	issuer: string,
	authorization_endpoint: string,
	token_endpoint: string,
	jwks_uri: string,
	token_endpoint_auth_methods_supported: string[],
	response_types_supported: string[],
	response_modes_supported: string[],
	grant_types_supported: string[],
	subject_types_supported: string[],
	scopes_supported: string[],
	id_token_signing_alg_values_supported: string[],
	token_endpoint_auth_signing_alg_values_supported: string[],
	access_token_issuer: string[],
	claims_supported: string[],
	end_session_endpoint: string[],
	userinfo_endpoint: string[],
}
describe('', () => {
	const config = {
		issuer: 'https://auth.tesla.com',
		authorization_endpoint: 'https://auth.tesla.com/oauth2/v3/authorize',
		token_endpoint: 'https://auth.tesla.com/oauth2/v3/token',
		jwks_uri: 'https://auth.tesla.com/oauth2/v3/discovery/thirdparty/keys',
		token_endpoint_auth_methods_supported: ['client_secret_post'],
		response_types_supported: ['code'],
		response_modes_supported: ['query'],
		grant_types_supported: ['authorization_code'],
		subject_types_supported: ['public'],
		scopes_supported: ['email', 'profile', 'openid', 'metadata'],
		id_token_signing_alg_values_supported: ['RS256'],
		token_endpoint_auth_signing_alg_values_supported: ['RS256'],
		access_token_issuer: 'https://auth.tesla.com/oauth2/v3/services/trust',
		claims_supported: ['iss', 'iat', 'exp', 'nonce', 'sub', 'aud'],
		end_session_endpoint: 'https://auth.tesla.com/oauth2/v3/logout',
		userinfo_endpoint: 'https://auth.tesla.com/oauth2/v3/userinfo'
	};
	it('', () => {

	});
});
