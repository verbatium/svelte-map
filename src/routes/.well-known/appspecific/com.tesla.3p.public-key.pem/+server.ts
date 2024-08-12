import {PUBLIC_TESLA_KEY} from '$env/static/public'


export async function GET() {
  return new Response(
    PUBLIC_TESLA_KEY,
    {
      headers: {
        'Content-Type': 'application/pem-certificate-chain'
      },
    }
  )
}