import {Parser} from 'xml2js'

const parser = new Parser({
  mergeAttrs: true,
})

export interface TileMapService {
  version: string
  tileMaps: TileMapDescription[]
}

export interface TileMapDescription {
  title: string
  srs: string
  profile: string
  href: string
}

export interface TileMap {
  version: string,
  tileMapService: string,
  title: string,
  abstract: string,
  srs: string,
  boundingBox: {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  },
  origin: {
    x: number,
    y: number
  },
  tileFormat: {
    width: number,
    height: number,
    mimeType: string,
    extension: string
  },
  tileSets: {
    href: string,
    unitsPerPixel: number,
    order: number
  }[]
}

interface TileMapResult {
  'TileMap': {
    'version': string [],
    'tilemapservice': string [],
    'Title': string [],
    'Abstract': string [],
    'SRS': string [],
    'BoundingBox': {
      'minx': number [],
      'miny': number [],
      'maxx': number [],
      'maxy': number []
    }[],
    'Origin': {
      'x': number[],
      'y': number[]
    }[],
    'TileFormat': {
      'width': number [],
      'height': number [],
      'mime-type': string [],
      'extension': string[]
    } [],
    'TileSets': {
      'TileSet': {
        'href': string [],
        'units-per-pixel': number [],
        'order': number[]
      } []
    } []
  }
}

interface TileMapServiceResult {
  TileMapService: {
    version: string
    TileMaps: [{
      TileMap: [{
        title: string[]
        srs: string[]
        profile: string[]
        href: string[]
      }]
    }]
  }
}

export async function downloadTileMapService(url: string): Promise<TileMapService> {
  const response = await fetch(url)
  const xml = await response.text()
  return tileMapService(xml)
}
export async function downloadTileMap(url: string): Promise<TileMap> {
  const response = await fetch(url)
  const xml = await response.text()
  return tileMap(xml)
}

export async function tileMapService(xml: string): Promise<TileMapService> {
  const json = (await parser.parseStringPromise(xml)) as unknown as TileMapServiceResult
  return {
    version: json.TileMapService?.version[0],
    tileMaps: json.TileMapService?.TileMaps[0].TileMap.map(i => {
      return {
        title: i.title[0],
        srs: i.srs[0],
        profile: i.profile[0],
        href: i.href[0],
      }
    }),
  }
}

export async function tileMap(xml: string): Promise<TileMap> {
  const json = (await parser.parseStringPromise(xml)) as unknown as TileMapResult
  const tileMap = json.TileMap
  return {
    abstract: tileMap.Abstract[0],
    boundingBox: {
      maxX: +tileMap.BoundingBox[0].maxx[0],
      maxY: +tileMap.BoundingBox[0].maxy[0],
      minX: +tileMap.BoundingBox[0].minx[0],
      minY: +tileMap.BoundingBox[0].miny[0]
    },
    origin: {
      x: +tileMap.Origin[0].x[0],
      y: +tileMap.Origin[0].y[0]
    },
    srs: tileMap.SRS[0],
    tileFormat: {
      extension: tileMap.TileFormat[0].extension[0],
      height: +tileMap.TileFormat[0].height[0],
      mimeType: tileMap.TileFormat[0]['mime-type'][0],
      width: +tileMap.TileFormat[0].width[0],
    },
    title: tileMap.Title[0],
    version: tileMap.version[0],
    tileMapService: tileMap.tilemapservice[0],
    tileSets: tileMap.TileSets[0].TileSet.map(i=> {
      return {
        href: i.href[0],
        unitsPerPixel: +i['units-per-pixel'][0],
        order: +i.order[0],
      }
    })
  }
}