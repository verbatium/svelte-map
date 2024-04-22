import {describe, expect, it} from 'vitest'
import {Epsg3301Tiles} from './Epsg3301Tiles'

describe('Epsg3301Tiles', () => {
  const epsg3301Tiles = new Epsg3301Tiles()
  
  it('unitsPerPixel at specified level ', () => {
    expect(epsg3301Tiles.unitsPerPixel(0)).eql(4000)
    expect(epsg3301Tiles.unitsPerPixel(1)).eql(2000)
    expect(epsg3301Tiles.unitsPerPixel(14)).eql(0.244140625)
  })
  
  it('unitsPerPixel at specified level ', () => {
    expect(epsg3301Tiles.bbox(40500, 5993000, 0)).eql({x: 40500, y: 5993000, width: 1024000, height: 1024000})
    expect(epsg3301Tiles.bbox(40500, 5993000, 1)).eql({x: 40500, y: 5993000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bbox(40500+512000, 5993000, 1)).eql({x: 40500+512000, y: 5993000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bbox(40500+512000-1, 5993000, 1)).eql({x: 40500, y: 5993000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bbox(40500, 5993000+512000, 1)).eql({x: 40500, y: 5993000+512000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bbox(40500, 5993000+512000-1, 1)).eql({x: 40500, y: 5993000, width: 512000, height: 512000})
  })
})