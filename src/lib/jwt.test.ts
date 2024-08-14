import { describe, expect, it } from 'vitest';
import { verify } from '$lib/jwt';

describe('jwt test', () => {
	const token =
		'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InE0dHg3Q1UyYzI2V1BiemwxZjZjanM3QnhzayJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzbGEuY29tL29hdXRoMi92My9udHMiLCJhenAiOiI4NTY1M2NlYi00ZmEwLTRhYzUtYjc0OS0xOTIwNWQxMTJkNDIiLCJzdWIiOiI4NWIyZGQ4OC0zN2FmLTQ5ODYtOWNiMy1kYzNiNzVjYTdmNDgiLCJhdWQiOlsiaHR0cHM6Ly9mbGVldC1hcGkucHJkLm5hLnZuLmNsb3VkLnRlc2xhLmNvbSIsImh0dHBzOi8vZmxlZXQtYXBpLnByZC5ldS52bi5jbG91ZC50ZXNsYS5jb20iLCJodHRwczovL2F1dGgudGVzbGEuY29tL29hdXRoMi92My91c2VyaW5mbyJdLCJzY3AiOlsib3BlbmlkIiwidmVoaWNsZV9jaGFyZ2luZ19jbWRzIl0sImFtciI6WyJwd2QiLCJtZmEiLCJvdHAiXSwiZXhwIjoxNzIzNTg5NTM1LCJpYXQiOjE3MjM1NjA3MzUsIm91X2NvZGUiOiJFVSIsImxvY2FsZSI6ImVuLUVFIiwiYWNjb3VudF90eXBlIjoicGVyc29uIiwib3Blbl9zb3VyY2UiOmZhbHNlLCJhY2NvdW50X2lkIjoiYTYyYWZmMjgtOTlmMS00MDdmLWE2OTUtOWI1MjFmMWM3YTRhIiwiYXV0aF90aW1lIjoxNzIzNTYwNzM0LCJub25jZSI6IjgzMjI2In0.zBgLUsyfGVp740_NShLOrivK_rgU1MaJy7p8od8Uo_msOLNq386QYiJIBkhJHAawgc9Wrpjqt_bJ2noI4jPq1iJRraRehk0ghg1C5i-3K2azpI28l73dVyS2cmqLF8KXfHeU0HcCvtQBobXofV-pnFqaQ6y16Xe_SGvYnbeIo9PWY8kDXxyhp3khV2GKarOdiq6vkOvieJyYKUbtjhYO1w98138chQBOwJXL6wGxEBxbspy2cDNGR0Pb-FlGORzy5Wt6w-haPu475h_RHyp2Rl_AtPr9PnZPTzm9fauvapKxVFMrZVBGYRQVUra7H3UEcMrDKI-qZXlTb2KHZvmLkQ'
	const teslaKeys = {
		keys: [
			{
				kty: 'RSA',
				n: 'wXvAk2TVaA-9K3rkzGX9evAzoAtzHXoZr5S4fw0Y1MBikLriXjwZP6pvef60i27XcnQVB9rAtDivUXHOJyYlI1pxMkansjwlQBIkKAbmG9B2PChBGiwaUk2Nv8KVwpagzcaEK7L98EFFoeVrW_QTHxrLpvDWoXPNZ_a0vPKrP0hBwkdWE-Up7rGnaHfqCyAEvWVJdKKQyt7B63kaFlw1diVzdtmKYW9UzjRDtMZPA-2_C7BvElNw7tVEZGZMhjy2sR3ihG0PrJGy2MBKMA6S9cSoWypbgQ9sUUIupzAKmwPJ8Hua53_zqBkZy4w1M1X6L4hZ4BiwZ3b0oHI4QmdjpQ',
				e: 'AQAB',
				kid: 'MFQjLiQx8FDxGdkiuT8n9nQDcQ4',
				x5t: 'MFQjLiQx8FDxGdkiuT8n9nQDcQ4',
				x5c: [
					'MIIDhDCCAmwCCQDASGzUYhffxTANBgkqhkiG9w0BAQUFADCBgzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEjAQBgNVBAcMCVBhbG8gQWx0bzETMBEGA1UECgwKVGVzbGEsIEluYzEdMBsGA1UECwwUSW5mb3JtYXRpb24gU2VjdXJpdHkxFzAVBgNVBAMMDmF1dGgudGVzbGEuY29tMB4XDTIyMTIwMTA3MTIyNVoXDTIzMTIwMTA3MTIyNVowgYMxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRIwEAYDVQQHDAlQYWxvIEFsdG8xEzARBgNVBAoMClRlc2xhLCBJbmMxHTAbBgNVBAsMFEluZm9ybWF0aW9uIFNlY3VyaXR5MRcwFQYDVQQDDA5hdXRoLnRlc2xhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMF7wJNk1WgPvSt65Mxl/XrwM6ALcx16Ga+UuH8NGNTAYpC64l48GT+qb3n+tItu13J0FQfawLQ4r1FxzicmJSNacTJGp7I8JUASJCgG5hvQdjwoQRosGlJNjb/ClcKWoM3GhCuy/fBBRaHla1v0Ex8ay6bw1qFzzWf2tLzyqz9IQcJHVhPlKe6xp2h36gsgBL1lSXSikMrewet5GhZcNXYlc3bZimFvVM40Q7TGTwPtvwuwbxJTcO7VRGRmTIY8trEd4oRtD6yRstjASjAOkvXEqFsqW4EPbFFCLqcwCpsDyfB7mud/86gZGcuMNTNV+i+IWeAYsGd29KByOEJnY6UCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAXD+fHfprtFo/Q1dpqJ3XDNO3mtrW+iicgyu7/j4IGtLp/3xmhzQXE98Qw9NqVKGdMilCVR4rvXAGSdBpSchen2sHNj6pG7N6WfF47sURtPIJTJ/y70KsMyIDjPPX5Aq7mOQsrwiUybZaQ7lxHFzNB+u4qdpyo7Jst0mqfkYyeSUSrt6Vv7tnZU4m1+A7zw4qaoZ8s+Ao71Je22eXxMmDX6CZmXwQXN44SeMmlCbYUykv4JBBLqrOiLpqTSFbabc3Syf10N26B37wyjfMog4CtMf7lDMRcpCLS9jyYrLtnRCPXCuqYLiKRogCt7oNuKQZN72mqZi68UWPh2r48+lIbQ=='
				],
				use: 'sig',
				alg: 'RS256'
			},
			{
				kty: 'RSA',
				n: '1618g4DElcx8dwhQS2U5pVZ8ZMylOzqz06WEKCSaM3T5o2UeZOtQhjKOPQsdk1mDxB5_ij8Aohlz5YcTx81MEoUdaUkN-mKKoS0auFmWxdy1Hzi3OP168t2O0M-TGlSNjAwvVA4eE19KsULg1gp146d2BK5ksvfh4FhK61C6MWRr1NNRKqPVjusfwX9tBiaTCxVt507JmRy2egw0_HaoLTlMwdoIxrPprlRFLaMq9YiTwRw8ONMPFCHBOREq94TtTvLAUkFPi__F9XA3Dn0Dnkgb3t5VgkU94LPlNN4SuH_VBUsvx3LkF2M9-AkKnj6SBx1mIi84o-AZxb_zrT8n6Q',
				e: 'AQAB',
				kid: 'q4tx7CU2c26WPbzl1f6cjs7Bxsk',
				x5t: 'q4tx7CU2c26WPbzl1f6cjs7Bxsk',
				x5c: [
					'MIIDhDCCAmwCCQDyz3E3ALQVMjANBgkqhkiG9w0BAQUFADCBgzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEjAQBgNVBAcMCVBhbG8gQWx0bzETMBEGA1UECgwKVGVzbGEsIEluYzEdMBsGA1UECwwUSW5mb3JtYXRpb24gU2VjdXJpdHkxFzAVBgNVBAMMDmF1dGgudGVzbGEuY29tMB4XDTIzMTEyODE3NDYyOVoXDTI0MTEyNzE3NDYyOVowgYMxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRIwEAYDVQQHDAlQYWxvIEFsdG8xEzARBgNVBAoMClRlc2xhLCBJbmMxHTAbBgNVBAsMFEluZm9ybWF0aW9uIFNlY3VyaXR5MRcwFQYDVQQDDA5hdXRoLnRlc2xhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANetfIOAxJXMfHcIUEtlOaVWfGTMpTs6s9OlhCgkmjN0+aNlHmTrUIYyjj0LHZNZg8Qef4o/AKIZc+WHE8fNTBKFHWlJDfpiiqEtGrhZlsXctR84tzj9evLdjtDPkxpUjYwML1QOHhNfSrFC4NYKdeOndgSuZLL34eBYSutQujFka9TTUSqj1Y7rH8F/bQYmkwsVbedOyZkctnoMNPx2qC05TMHaCMaz6a5URS2jKvWIk8EcPDjTDxQhwTkRKveE7U7ywFJBT4v/xfVwNw59A55IG97eVYJFPeCz5TTeErh/1QVLL8dy5BdjPfgJCp4+kgcdZiIvOKPgGcW/860/J+kCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAgRaBNz84ITAQYsep8WtSsqGfgvbY0jv6D52vPBwyO3CQaSAtlDEaeA3haNnsnyIifnZQKHYNBwQJVVx7KkxnA2AYJSo6VZYIPhvX9gUQqVgDAYQ9UOmJJ0fSCLCAHQ43npIEvzg1iD2HGEqLL+VzmzGYC3JiJXghqT3aREayU2GK86HAjT+i549JNWQUHW6lLxtKlYv692k0uAmmOHmgk8AvLJntRoKmtO6i7SaJ/ET04m1Kd/IZ7o+7ZsjpnetgaqC/tuEh6g0MWcsxu+WodSSsOrEYGFTZAfEd93H/+W0h6pBNUf2N9yw5adF5oGI+MGZMEpfnP6PchsrO1j6hMQ=='
				],
				use: 'sig',
				alg: 'RS256'
			}
		]
	};
	
	it('should ', async () => {
		const parts = token.split('.');
		expect(parts.length).toEqual(3);
		const header = JSON.parse(atob(parts[0]));
		const payload = JSON.parse(atob(parts[1]));
		expect(header).toEqual({
			alg: 'RS256',
			typ: 'JWT',
			kid: 'q4tx7CU2c26WPbzl1f6cjs7Bxsk'
		});
		expect(payload).toEqual({
			iss: 'https://auth.tesla.com/oauth2/v3/nts',
			azp: '85653ceb-4fa0-4ac5-b749-19205d112d42',
			sub: '85b2dd88-37af-4986-9cb3-dc3b75ca7f48',
			aud: [
				'https://fleet-api.prd.na.vn.cloud.tesla.com',
				'https://fleet-api.prd.eu.vn.cloud.tesla.com',
				'https://auth.tesla.com/oauth2/v3/userinfo'
			],
			scp: ['openid', 'vehicle_charging_cmds'],
			amr: ['pwd', 'mfa', 'otp'],
			exp: 1723589535,
			iat: 1723560735,
			ou_code: 'EU',
			locale: 'en-EE',
			account_type: 'person',
			open_source: false,
			account_id: 'a62aff28-99f1-407f-a695-9b521f1c7a4a',
			auth_time: 1723560734,
			nonce: '83226'
		});
	});

	it('should be true', async () => {
		const result = await verify(token, teslaKeys);
		expect(result).toBeTruthy;
	});
});
