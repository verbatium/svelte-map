export interface TileSystemInit {
  tileSize: number | undefined
}

export class Epsg3301Tiles {
  get tileSize(): number {
    return this._tileSize
  }
  
  get originY(): number {
    return this._originY
  }
  
  set originY(value: number) {
    this._originY = value
  }
  
  get originX(): number {
    return this._originX
  }
  
  minx = 365000.000000
  miny = 6375000.000000
  maxx = 740000.000000
  maxy = 6635000.000000
  private _originX = 40500.000000
  private _originY = 5993000.000000
  srs = 'EPSG:3301'
  private _tileSize
  mimeType = 'image/png'
  extension = 'png'
  unitsPerPixel0 = 4000
  maxLevel = 14
  
  constructor(init: TileSystemInit | undefined) {
    this._tileSize = init?.tileSize ?? 256
  }
  
  bboxByUserXY(x: number, y: number, z: number): { x: number, y: number, width: number, height: number } {
    const size = this._tileSize * this.unitsPerPixel(z)
    return {
      x: this.getStartOfTile(this._originX, x, size),
      y: this.getStartOfTile(this._originY, y, size),
      width: size,
      height: size,
    }
  }
  
  bboxByTileXY(x: number, y: number, z: number): { x: number, y: number, width: number, height: number } {
    const size = this._tileSize * this.unitsPerPixel(z)
    return {
      x: this._originX + x * size,
      y: this._originY + y * size,
      width: size,
      height: size,
    }
  }
  
  private getStartOfTile(origin: number, value: number, step: number) {
    return origin + Math.floor((value - origin) / step) * step
  }
  
  unitsPerPixel(z: number): number {
    return this.unitsPerPixel0 / (1 << z)
  }
  
  
  userXYToTileXY(userX: number, userY: number, z: number): number[] {
    const perPixel = this.unitsPerPixel(z)
    const tileX = Math.floor((userX - this._originX) / perPixel / this._tileSize)
    const tileY = Math.floor((userY - this._originY) / perPixel / this._tileSize)
    return [tileX, tileY, z]
  }
  
  visibleTilesByClientViewBox(viewBox: { x: number, y: number, width: number, height: number }, z: number): number[][] {
    const p1 = this.userXYToTileXY(viewBox.x, viewBox.y, z)
    const p2 = this.userXYToTileXY(viewBox.x + viewBox.width, viewBox.y + viewBox.height, z)
    const diameter = Math.max(p2[0] - p1[0], p2[1] - p1[1])
    const radius = Math.floor(diameter / 2)
    const center = p1.map(i => i + radius)
    const maxV = 1 << z
    return this.neighborsInSpiral(center[0], center[1], diameter + 1)
      .filter(([x, y]) => x >= 0 && y >= 0 && x < maxV && y < maxV)
  }
  
  neighborsInSpiral(x: number, y: number, diameter: number): number[][] {
    let n = 0
    const result: number[][] = [[x, y]]
    while (n++ < diameter) {
      const sign = ((n % 2) << 1) - 1
      result.push([x, y += sign])
      for (let i = 0; i < n; i++) result.push([x += sign, y])
      for (let i = 0; i < n; i++) result.push([x, y -= sign])
    }
    return result
  }
}

export const epsg3301Tiles = new Epsg3301Tiles(undefined)
