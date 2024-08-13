import {PUBLIC_TESLA_KEY} from '$env/static/public'


export async function GET() {
  return new Response(
    atob(PUBLIC_TESLA_KEY),
    {
      headers: {
        'Content-Type': 'application/pem-certificate-chain'
      },
    }
  )
}