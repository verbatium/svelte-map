import type {Projection, Spheroid} from './LambertConformalConic'


export class PseudoMerkator implements Projection {
  private _spheroid: Spheroid
  private _degreeToRadian = Math.PI / 180
  
  constructor(spheroid: Spheroid) {
    this._spheroid = spheroid
  }
  
  directConversion(lat: number, lon: number): number[] {
    //easting
    const x = lon * this._spheroid.a * this._degreeToRadian
    //northing
    const y = this._spheroid.a * Math.log(Math.tan(Math.PI / 4 + lat * this._degreeToRadian / 2))
    return [x, y]
  }
  
  //x: easting
  //y: northing
  inverseConversion(x: number, y: number): number[] {
    const lat = (Math.atan(Math.exp(y / this._spheroid.a)) - Math.PI / 4) / (this._degreeToRadian / 2)
    const lon = x / (this._spheroid.a * this._degreeToRadian)
    return [lat, lon]
  }
  
  get name(): string {
    return 'EPSG:3857'
  }
}


export const WGS_84: Spheroid = {
  name: 'WGS84',
  a: 6378137,
  inverseF: 298.257223563,
}