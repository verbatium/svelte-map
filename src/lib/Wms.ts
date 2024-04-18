import {Parser} from 'xml2js'

export class Wms {
  private readonly _url: string
  private readonly _version: string
  private readonly _mapFormats: string[]
  private readonly _title: string
  private readonly _llBbox: Bbox
  private readonly _supportedSrs: string[]
  private readonly _bboxes: SrsBbox[]
  private readonly _layers: WmsLayer[]
  
  
  constructor(init: WmsInit) {
    this._url = init.url
    this._version = init.version ?? '1.1.1'
    this._title = init.title
    this._mapFormats = init.mapFormats
    this._llBbox = init.llBbox
    this._supportedSrs = init.supportedSrs
    this._bboxes = init.bboxes
    this._layers = init.layers
  }
  
  
  get url(): string {
    return this._url
  }
  
  get version(): string {
    return this._version
  }
  
  get mapFormats(): string[] {
    return this._mapFormats
  }
  
  get title(): string {
    return this._title
  }
  
  get llBbox(): Bbox {
    return this._llBbox
  }
  
  get supportedSrs(): string[] {
    return this._supportedSrs
  }
  
  get bboxes(): SrsBbox[] {
    return this._bboxes
  }
  
  get layers(): WmsLayer[] {
    return this._layers
  }
  
  get capabilitiesUrl(): string {
    return Wms.getCapabilitiesUrl(this._url, this._version)
  }
  
  static getCapabilitiesUrl(url: string, version: string = '1.1.1'): string {
    const baseUrl: URL = new URL(url)
    baseUrl.searchParams.set('service', 'wms')
    baseUrl.searchParams.set('version', version)
    baseUrl.searchParams.set('request', 'GetCapabilities')
    return baseUrl.toString()
  }
  
  private static async loadCapabilitiesXml(url: string): Promise<string> {
    return (await fetch(url)).text()
  }
  
  
  getUrl(viewBox: DOMRect, width: number, height: number): string {
    const baseUrl = new URL(this._url)
    baseUrl.searchParams.set('REQUEST', 'GetMap')
    baseUrl.searchParams.set('SERVICE', 'WMS')
    baseUrl.searchParams.set('VERSION', this._version)
    baseUrl.searchParams.set('FORMAT', 'image/png')
    baseUrl.searchParams.set('STYLES', '')
    baseUrl.searchParams.set('TRANSPARENT', 'true')
    baseUrl.searchParams.set('LAYERS', 'cells263')
    baseUrl.searchParams.set('WIDTH', width.toString())
    baseUrl.searchParams.set('HEIGHT', height.toString())
    baseUrl.searchParams.set('SRS', 'EPSG:3301')
    const bbox = `${viewBox.x},${viewBox.y},${viewBox.x + viewBox.width},${viewBox.y + viewBox.height}`
    baseUrl.searchParams.set('BBOX', bbox)
    return baseUrl.toString()
  }
  
  static async load(url: string, version: string = '1.1.1'): Promise<WmsInit> {
    const xmlUrl = Wms.getCapabilitiesUrl(url, version)
    const xml = await Wms.loadCapabilitiesXml(xmlUrl)
    return Wms.parse(xml, url)
  }
  
  static async parse(xml: string, url: string): Promise<WmsInit> {
    const parser = new Parser({
      explicitRoot: false,
      mergeAttrs: true,
      xmlns: false,
    })
    console.log(xml)
    const newVar = await parser.parseStringPromise(xml)
    const resourceUrl: string = newVar['Service'][0]['OnlineResource'][0]['xlink:href'][0]
    const capability = newVar['Capability'][0]
    const mapFormats = capability['Request'][0]['GetMap'][0]['Format']
    const layer = capability['Layer'][0]
    
    const title: string = layer['Title']?.[0]
    const supportedSrs: string[] = layer['SRS']
    const llBbox: Bbox = layer['LatLonBoundingBox']?.map((i: {
      maxx: number[],
      maxy: number[],
      minx: number[],
      miny: number[]
    }) => ({
      maxX: i.maxy[0],
      maxY: i.maxy[0],
      minX: i.minx[0],
      minY: i.miny[0],
    }) as Bbox)[0]
    const bboxes: SrsBbox[] = layer['BoundingBox'].map((i: {
      SRS: string[],
      CRS: string[],
      maxx: number[],
      maxy: number[],
      minx: number[],
      miny: number[]
    }) => ({
      srs: (i['SRS'] ?? i['CRS'])?.[0],
      maxX: i['maxx'][0],
      maxY: i['maxy'][0],
      minX: i['minx'][0],
      minY: i['miny'][0],
    } as SrsBbox)) ?? []
    const layers: WmsLayer[] = layer['Layer'].map((l: {
      noSubsets: string[]
      opaque: string[]
      queryable: string[]
      Name: string[]
      Title: string[]
      Abstract: string[]
      Style: { Name: string[], Title: string[], Abstract: string[] }[]
    }) => ({
      noSubsets: +(l['noSubsets']?.[0] ?? 0) === 1,
      opaque: +(l['opaque']?.[0] ?? 0) === 1,
      queryable: +l['queryable'][0] === 1, //GetFeatureInfo works if true
      name: l['Name'][0],
      title: l['Title'][0],
      abstract: (l['Abstract'] || [])[0],
      styles: (l['Style'] || []).map(s => ({
        name: s['Name'][0],
        title: s['Title'][0],
        abstract: (s['Abstract'] || [])[0],
      } as WmsStyle)),
    } as WmsLayer))
    
    return {
      url: url ?? resourceUrl,
      version: newVar['version'][0],
      title,
      mapFormats,
      llBbox,
      supportedSrs,
      bboxes,
      layers,
    }
  }
  
}

export interface Bbox {
  maxX: number,
  maxY: number,
  minX: number,
  minY: number,
}

interface SrsBbox extends Bbox {
  srs: string
}

interface WmsStyle {
  name: string
  title: string
  abstract: string
}

interface WmsLayer extends WmsStyle {
  noSubsets: boolean
  opaque: boolean
  queryable: boolean
  styles: WmsStyle[]
}

interface WmsInit {
  url: string
  version: string
  mapFormats: string[]
  title: string
  llBbox: Bbox
  supportedSrs: string[]
  bboxes: SrsBbox[]
  layers: WmsLayer[]
}