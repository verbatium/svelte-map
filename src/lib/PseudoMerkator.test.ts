import {describe, expect, it} from 'vitest'
import {PseudoMerkator, WGS_84} from '$lib/PseudoMerkator'

describe('PseudoMerkator', () => {
  const proj = new PseudoMerkator(WGS_84)
  it('should ', () => {
    expect(proj.directConversion(0, 0)).eql([0, -7.081154551613622e-10])
    expect(proj.inverseConversion(0, -7.081154551613622e-10)).eql([0, 0])
    
    expect(proj.directConversion(53, 24)).eql([2671667.7790385657, 6982997.920389787])
    expect(proj.inverseConversion(2671667.7790385657, 6982997.920389787)).eql([53.00000000000001, 24])
  })
})