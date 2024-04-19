import {describe, expect, it} from 'vitest'
import {lest97, llcHolberg} from '$lib/LambertConformalConic'

describe('lambert', () => {
  it('Lest97 ', () => {
    expect(lest97.directConversion(24, 59)).eql([4464234.877490138, 3500119.0240256125])
    expect(lest97.inverseConversion(4464234.877490138, 3500119.0240256125)).eql([24, 59])
  })
  
  it('Hojborg ', () => {
    // 50°00'00.000 'N geodetic longitude: 5°00'00.000'E 2 596 848.66 m easting (E) 3 654 072.12 m
    expect(llcHolberg.directConversion(50, 5)).eql([3654072.1218646523, 2596848.659964405])
    expect(llcHolberg.inverseConversion(3654072.1218646523, 2596848.659964405)).eql([50, 5])
    
    // 60°00'00.000 "N geodetic longitude: 5°00'00.000 'E 3 673 790.20 m easting (E) 3 727 054.58 m
    expect(llcHolberg.directConversion(60, 5)).eql([3727054.5841429443, 3673790.202875774])
    expect(llcHolberg.inverseConversion(3727054.5841429443, 3673790.202875774)).eql([60, 5])
  })
  
})