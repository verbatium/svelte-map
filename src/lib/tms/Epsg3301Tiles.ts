export class Epsg3301Tiles {
  minx = 365000.000000
  miny = 6375000.000000
  maxx = 740000.000000
  maxy = 6635000.000000
  originX = 40500.000000
  originY = 5993000.000000
  srs = 'EPSG:3301'
  tileSize = 256
  mimeType = 'image/png'
  extension = 'png'
  unitsPerPixel0 = 4000
  maxLevel = 14
  
  bboxByUserXY(x: number, y: number, z: number): { x: number, y: number, width: number, height: number } {
    const size = this.tileSize * this.unitsPerPixel(z)
    return {
      x: this.getStartOfTile(this.originX, x, size),
      y: this.getStartOfTile(this.originY, y, size),
      width: size,
      height: size,
    }
  }
  
  bboxByTileXY(x: number, y: number, z: number): { x: number, y: number, width: number, height: number } {
    const size = this.tileSize * this.unitsPerPixel(z)
    return {
      x: this.originX + x * size,
      y: this.originY + y * size,
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
    const tileX = Math.floor((userX - this.originX) / perPixel / this.tileSize)
    const tileY = Math.floor((userY - this.originY) / perPixel / this.tileSize)
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

export const epsg3301Tiles = new Epsg3301Tiles()
