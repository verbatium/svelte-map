export class Epsg3301Tiles {
  minx = 365000.000000
  miny = 6375000.000000
  maxx = 740000.000000
  maxy = 6635000.000000
  originX = 40500.000000
  originY = 5993000.000000
  srs = 'EPSG:3301'
  tileWidth = 256
  tileHeight = 256
  mimeType = 'image/png'
  extension = 'png'
  unitsPerPixel0 = 4000
  maxLevel = 14
  
  bbox(x: number, y: number, z: number): { x: number, y: number, width: number, height: number } {
    const perPixel = this.unitsPerPixel(z)
    const width = this.tileWidth * perPixel
    const height = this.tileHeight * perPixel
    return {
      x: this.getStartOfTile(this.originX, x, width),
      y: this.getStartOfTile(this.originY, y, height),
      width: width,
      height: height,
    }
  }
  
  private getStartOfTile(origin: number, value: number, step: number) {
    return origin + Math.floor((value - origin) / step) * step
  }
  
  unitsPerPixel(z: number): number {
    return this.unitsPerPixel0 / (1 << z)
  }
}
