import {describe, expect, it} from 'vitest'
import {Epsg3301Tiles} from './Epsg3301Tiles'

describe('Epsg3301Tiles', () => {
  const epsg3301Tiles = new Epsg3301Tiles(undefined)
  
  it('unitsPerPixel at specified level ', () => {
    expect(epsg3301Tiles.unitsPerPixel(0)).eql(4000)
    expect(epsg3301Tiles.unitsPerPixel(1)).eql(2000)
    expect(epsg3301Tiles.unitsPerPixel(14)).eql(0.244140625)
  })
  
  it('bboxByUserXY', () => {
    expect(epsg3301Tiles.bboxByUserXY(40500, 5993000, 0)).eql({x: 40500, y: 5993000, width: 1024000, height: 1024000})
    expect(epsg3301Tiles.bboxByUserXY(40500, 5993000, 1)).eql({x: 40500, y: 5993000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bboxByUserXY(40500 + 512000, 5993000, 1)).eql({
      x: 40500 + 512000,
      y: 5993000,
      width: 512000,
      height: 512000,
    })
    expect(epsg3301Tiles.bboxByUserXY(40500 + 512000 - 1, 5993000, 1)).eql({
      x: 40500,
      y: 5993000,
      width: 512000,
      height: 512000,
    })
    expect(epsg3301Tiles.bboxByUserXY(40500, 5993000 + 512000, 1)).eql({
      x: 40500,
      y: 5993000 + 512000,
      width: 512000,
      height: 512000,
    })
    expect(epsg3301Tiles.bboxByUserXY(40500, 5993000 + 512000 - 1, 1)).eql({
      x: 40500,
      y: 5993000,
      width: 512000,
      height: 512000,
    })
  })
  
  it('bboxByTileXY ', () => {
    expect(epsg3301Tiles.bboxByTileXY(0, 0, 0)).eql({x: 40500, y: 5993000, width: 1024000, height: 1024000})
    expect(epsg3301Tiles.bboxByTileXY(0, 0, 1)).eql({x: 40500, y: 5993000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bboxByTileXY(1, 0, 1)).eql({x: 40500 + 512000, y: 5993000, width: 512000, height: 512000})
    expect(epsg3301Tiles.bboxByTileXY(0, 1, 1)).eql({x: 40500, y: 5993000 + 512000, width: 512000, height: 512000})
  })
  
  it('bboxByTileXY ', () => {
    expect(epsg3301Tiles.userXYToTileXY(40500, 5993000, 0)).eql([0, 0, 0])
    expect(epsg3301Tiles.userXYToTileXY( 40500, 5993000 + 512000, 1)).eql([0, 1, 1])
  })
  
  it('neighborsInSpiral ', () => {
    expect(epsg3301Tiles.neighborsInSpiral(5,5,0)).eql([[5,5]])
    expect(epsg3301Tiles.neighborsInSpiral(0,0,0)).eql([[0,0]])
    expect(epsg3301Tiles.neighborsInSpiral(0,0,1)).eql([[0,0], [0,1], [1,1], [1,0]])
    expect(epsg3301Tiles.neighborsInSpiral(5,5,1)).eql([[5,5], [5,6], [6,6], [6,5]])
    expect(epsg3301Tiles.neighborsInSpiral(5,5,2)).eql([[5,5], [5,6], [6,6], [6,5], [6,4], [5,4], [4,4], [4,5], [4,6]])
    expect(epsg3301Tiles.neighborsInSpiral(5,5,3)).eql([[5,5], [5,6], [6,6], [6,5], [6,4], [5,4], [4,4], [4,5], [4,6], [4, 7,], [5, 7,], [6, 7,], [7, 7,], [7, 6,], [7, 5,], [7, 4,]])
  })
})