import {error} from '@sveltejs/kit'
import {Wms} from '$lib/Wms'

export async function load({params}) {
  const url = atob(params.url)
  console.log('url', url)
  
  const wms = await Wms.load(url)
  return {capabilities: wms}
  
  
  // error(404, 'Not found')
}