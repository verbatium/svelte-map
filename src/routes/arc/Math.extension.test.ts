import {describe, expect, it} from 'vitest'
import {approximateAngle} from './Math.extension'

describe('Math extension', () => {
  
  it('should approximateAngle', () => {
    expect(approximateAngle(4.7124, 4.2426, 1e-12)).closeTo(1.5708, 1e-4)
    expect(approximateAngle(3.4907, 1.9696, 1e-12)).closeTo(3.4907, 1e-4)
  })
  
})