export class TileSystem {
  private static EarthRadius = 6378137
  private static MinLatitude = -85.05112878
  private static MaxLatitude = 85.05112878
  private static MinLongitude = -180
  private static MaxLongitude = 180
  
  // Clips a number to the specified minimum and maximum values.
  private static clip(n: number, minValue: number, maxValue: number): number {
    return Math.min(Math.max(n, minValue), maxValue)
  }
  
  // Determines the map width and height (in pixels) at a specified level of detail.
  public static mapSize(levelOfDetail: number): number {
    return 256 << levelOfDetail
  }
  
  // Determines the ground resolution (in meters per pixel) at a specified latitude and level of detail.
  // Latitude (in degrees) at which to measure the ground resolution.
  // Level of detail, from 1 (lowest detail) to 23 (highest detail).
  // returns The ground resolution, in meters per pixel.</returns>
  public static groundResolution(latitude: number, levelOfDetail: number): number {
    latitude = TileSystem.clip(latitude, this.MinLatitude, TileSystem.MaxLatitude)
    return Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * TileSystem.EarthRadius / TileSystem.mapSize(levelOfDetail)
  }
  

  // Determines the map scale at a specified latitude, level of detail, and screen resolution.
  // Latitude (in degrees) at which to measure the map scale.
  // Level of detail, from 1 (lowest detail) to 23 (highest detail).
  // Resolution of the screen, in dots per inch.
  // returns The map scale, expressed as the denominator N of the ratio 1 : N.
  public static mapScale(latitude: number, levelOfDetail: number, screenDpi: number): number {
    return TileSystem.groundResolution(latitude, levelOfDetail) * screenDpi / 0.0254
  }
  
  // Converts a point from latitude/longitude WGS-84 coordinates (in degrees) into pixel XY coordinates at a specified level of detail.
  // Latitude of the point, in degrees.
  // Longitude of the point, in degrees.
  // Level of detail, from 1 (lowest detail) to 23 (highest detail).
  // Output parameter receiving the X coordinate in pixels.
  // Output parameter receiving the Y coordinate in pixels.
  public static latLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): number [] {
    
    latitude = TileSystem.clip(latitude, TileSystem.MinLatitude, TileSystem.MaxLatitude)
    longitude = TileSystem.clip(longitude, TileSystem.MinLongitude, TileSystem.MaxLongitude)
    
    const x = (longitude + 180) / 360
    const sinLatitude = Math.sin(latitude * Math.PI / 180)
    const y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)
    
    const mapSize = TileSystem.mapSize(levelOfDetail)
    const pixelX = Math.floor(TileSystem.clip(x * mapSize + 0.5, 0, mapSize - 1))
    const pixelY = Math.floor(TileSystem.clip(y * mapSize + 0.5, 0, mapSize - 1))
    return [pixelX, pixelY]
  }
  
  // Converts a pixel from pixel XY coordinates at a specified level of detail
  // into latitude/longitude WGS-84 coordinates (in degrees).
  // <param name="pixelX">X coordinate of the point, in pixels.</param>
  // <param name="pixelY">Y coordinates of the point, in pixels.</param>
  // <param name="levelOfDetail">Level of detail, from 1 (lowest detail) to 23 (highest detail).</param>
  // <param name="latitude">Output parameter receiving the latitude in degrees.</param>
  // <param name="longitude">Output parameter receiving the longitude in degrees.</param>
  public static pixelXYToLatLong(pixelX: number, pixelY: number, levelOfDetail: number): number[] {
    const mapSize = TileSystem.mapSize(levelOfDetail)
    const x = (TileSystem.clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5
    const y = 0.5 - (TileSystem.clip(pixelY, 0, mapSize - 1) / mapSize)
    
    const latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI
    const longitude = 360 * x
    return [latitude, longitude]
  }
  
  // Converts pixel XY coordinates into tile XY coordinates of the tile containing
  // the specified pixel.
  // <param name="pixelX">Pixel X coordinate.</param>
  // <param name="pixelY">Pixel Y coordinate.</param>
  // <param name="tileX">Output parameter receiving the tile X coordinate.</param>
  // <param name="tileY">Output parameter receiving the tile Y coordinate.</param>
  public static pixelXYToTileXY(pixelX: number, pixelY: number): number[] {
    const tileX = pixelX / 256
    const tileY = pixelY / 256
    return [tileX, tileY]
  }
  
  // Converts tile XY coordinates into pixel XY coordinates of the upper-left pixel of the specified tile.
  // <param name="tileX">Tile X coordinate.</param>
  // <param name="tileY">Tile Y coordinate.</param>
  // <param name="pixelX">Output parameter receiving the pixel X coordinate.</param>
  // <param name="pixelY">Output parameter receiving the pixel Y coordinate.</param>
  public static tileXYToPixelXY(tileX: number, tileY: number): number[] {
    const pixelX = tileX * 256
    const pixelY = tileY * 256
    return [pixelX, pixelY]
  }
  
  
  // Converts tile XY coordinates into a QuadKey at a specified level of detail.
  // <param name="tileX">Tile X coordinate.</param>
  // <param name="tileY">Tile Y coordinate.</param>
  // <param name="levelOfDetail">Level of detail, from 1 (lowest detail) to 23 (highest detail).</param>
  // <returns>A string containing the QuadKey.</returns>
  public static tileXYToQuadKey(tileX: number, tileY: number, levelOfDetail: number): string {
    let quadKey: string = ''
    for (let i = levelOfDetail; i > 0; i--) {
      let digit = 0
      const mask = 1 << (i - 1)
      if ((tileX & mask) != 0) {
        digit++
      }
      if ((tileY & mask) != 0) {
        digit++
        digit++
      }
      quadKey += digit
    }
    return quadKey
  }
  
  /// <summary>
  /// Converts a QuadKey into tile XY coordinates.
  /// </summary>
  /// <param name="quadKey">QuadKey of the tile.</param>
  /// <param name="tileX">Output parameter receiving the tile X coordinate.</param>
  /// <param name="tileY">Output parameter receiving the tile Y coordinate.</param>
  /// <param name="levelOfDetail">Output parameter receiving the level of detail.</param>
  public static quadKeyToTileXY(quadKey: string): number[] {
    let tileX = 0
    let tileY = 0
    const levelOfDetail = quadKey.length
    for (let i = levelOfDetail; i > 0; i--) {
      const mask = 1 << (i - 1)
      switch (quadKey[levelOfDetail - i]) {
        case '0':
          break
        
        case '1':
          tileX |= mask
          break
        
        case '2':
          tileY |= mask
          break
        
        case '3':
          tileX |= mask
          tileY |= mask
          break
        
        default:
          throw new Error('Invalid QuadKey digit sequence.')
      }
    }
    return [tileX, tileY, levelOfDetail]
  }
}
