interface Header {
	alg: string;
	typ: string;
	kid: string;
}

interface JWTPayload {
	aud: string; //JWT Audience
	exp: number; //JWT Expiration Time
	iat: number; //JWT Issued At
	iss: string; //JWT Issuer
	jti: string; //JWT ID
	nbf: number; //JWT Not Before
	sub: string; //JWT Subject
}

interface JwksKeyId {
	kid: string;
}

interface JsonWebKeySets {
	keys: (JsonWebKey & JwksKeyId)[];
}

const algorithms = {
	RS256: { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } } as Algorithm
};

//PARTNER: https://auth.tesla.com/oauth2/v3/.well-known/openid-configuration
//third party: https://auth.tesla.com/oauth2/v3/thirdparty/.well-known/openid-configuration
//https://accounts.google.com/.well-known/openid-configuration
//https://appleid.apple.com/.well-known/openid-configuration
//https://www.facebook.com/.well-known/openid-configuration/
//https://token.actions.githubusercontent.com/.well-known/openid-configuration
//https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
//https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration
//https://login.microsoftonline.com/consumers/v2.0/.well-known/openid-configuration

//https://auth.tesla.com/oauth2/v3/discovery/thirdparty/keys

export async function jwtPayload(token: string): Promise<JWTPayload> {
	const parts = token.split('.');
	return await JSON.parse(atob(parts[1])) as unknown as JWTPayload;
}

export async function verify(token: string, teslaKeys: JsonWebKeySets): Promise<boolean> {
	const parts = token.split('.');
	const header: Header = JSON.parse(atob(parts[0]));
	const jsonWebKey: JsonWebKey = teslaKeys.keys.filter((k) => k.kid === header.kid)[0];
	const algorithm = algorithms[header.alg as keyof typeof algorithms];

	const cryptoKey = await crypto.subtle.importKey('jwk', jsonWebKey, algorithm, false, ['verify']);

	return crypto.subtle.verify(
		algorithm,
		cryptoKey,
		Buffer.from(parts[2], 'base64'),
		new TextEncoder().encode(parts.slice(0, 2).join('.'))
	);
}
