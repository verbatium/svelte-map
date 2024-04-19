//According to: http://mapref.org/LinkedDocuments/MapProjectionsForEurope-EUR-20120.pdf
export interface Spheroid {
  name: string
  a: number
  inverseF: number
}

export interface Projection {
  get name(): string
  
  directConversion(lat: number, lon: number): number[]
  
  inverseConversion(x: number, y: number): number[]
}

const GRS_1980: Spheroid = {name: 'GRS_1980', a: 6378137, inverseF: 298.257222101}

export class LambertConformalConic implements Projection {
  private _spheroid: Spheroid
  private _a: number
  private _f: number
  private _e2: number
  private _e: number
  private _Bu: number
  private _Bl: number
  private _Bb: number
  private _L0: number
  private _E0: number
  private _N0: number
  private _R0: number
  private _sinB0: number
  private _K: number
  private _tolerance: number
  
  constructor(spheroid: Spheroid, lowerParallel: number, upperParallel: number, latitudeGridOrigin: number, longitudeGridOrigin: number, falseEasting: number, falseNorting: number, tolerance = 1e-12) {
    this._spheroid = spheroid
    //Symbols and Definitions (all angles are expressed in radians)
    this._a = spheroid.a // a - semi-major axis of the ellipsoid
    // b - semi-minor axis of the ellipsoid
    this._f = 1 / spheroid.inverseF // f - flattening of the ellipsoid
    // e² - first eccentricity squared e²=2f-f²
    this._e2 = 2 * this._f - Math.pow(this._f, 2)
    this._e = Math.sqrt(this._e2)
    this._Bu = this.degreeToRad(upperParallel) //φᵤ - upper parallel 59°20'
    this._Bl = this.degreeToRad(lowerParallel) // φₗ - lower parallel 58°00'
    this._Bb = this.degreeToRad(latitudeGridOrigin)  // φb - latitude of (false) grid origin in case of 2 parallels 57°31'03.19415"
    // k₀ - point scale factor at central parallel (CP)
    // λ₀ longitude grid origin, central reference meridian (RM, λ₀),
    this._L0 = this.degreeToRad(longitudeGridOrigin)
    // E₀ false easting
    this._E0 = falseEasting
    // N₀ false northing
    this._N0 = falseNorting
    this._tolerance = tolerance
    
    const sinBu = Math.sin(this._Bu)
    const sinBl = Math.sin(this._Bl)
    const Ql = this.Q(sinBl)
    const Wl = this.W(sinBl)
    // const Wb = this.W(sinBb)
    this._sinB0 = Math.log(this.W(sinBu) * Math.cos(this._Bl) / (Wl * Math.cos(this._Bu))) / (this.Q(sinBu) - Ql)
    // K mapping radius at the equator
    this._K = this._a * Math.cos(this._Bl) * Math.exp(Ql * this._sinB0) / (Wl * this._sinB0)
    // R mapping radius at latitude φ
    this._R0 = this._K / Math.exp(this.Q(Math.sin(this._Bb)) * this._sinB0)
  }
  
  get name(): string {
    return 'Lambert_Conformal_Conic'
  }
  
  // E easting coordinate
  // N northing coordinate
  inverseConversion(E: number, N: number): number[] {
    const Ri = (this._R0 - N + this._N0)
    const Ei = (this._E0 - E)
    const y = Math.atan(Ei / Ri)    // γ convergence angle
    const L = this._L0 - y / this._sinB0
    const R = Math.sqrt(Math.pow(Ri, 2) + Math.pow(Ei, 2))
    const q = Math.log(this._K / R) / this._sinB0
    const sinB = (Math.exp(2 * q) - 1) / (Math.exp(2 * q) + 1)
    const B = Math.asin(this.sinFromQ(q, sinB))
    return [this.round(this.radToDegree(B)), this.round(this.radToDegree(L))]
  }

  // B: φ parallel of geodetic latitude, positive North
  // L: λ meridian of geodetic longitude, positive East
  directConversion(B: number, L: number): number[] {
    const bRad = this.degreeToRad(B)
    const sinB = Math.sin(bRad)
    const q = this.Q(sinB)
    const R = this._K / Math.exp(q * this._sinB0)
    const lRad = this.degreeToRad(L)
    const y = (this._L0 - lRad) * this._sinB0 // γ convergence angle
    const E = this._E0 - R * Math.sin(y)
    const N = this._R0 + this._N0 - R * Math.cos(y)
    const k = this.W(sinB) * R * this._sinB0 / (this._spheroid.a * Math.cos(bRad))  // k grid scale factor at a general point
    return [E, N]
  }
  
  private round(value: number): number {
    return Math.round(value / this._tolerance) * this._tolerance
  }
  
  sinFromQ(q: number, initialSinLat: number): number {
    const e2 = this._e * this._e
    let sinLat = initialSinLat
    // Iterate using Newton's method until convergence
    let delta = 1
    while (Math.abs(delta) > this._tolerance) {
      const sinLat2 = sinLat * sinLat
      const prime = (1 / (1 - sinLat2)) - (e2 / (2 * (1 - (e2 * sinLat2))))
      delta = -(this.Q(sinLat) - q) / prime
      sinLat += delta
    }
    return sinLat
  }
  
  // Q isometric latitude
  public Q(sinLat: number) {
    return (Math.log((1 + sinLat) / (1 - sinLat)) - this._e * Math.log((1 + this._e * sinLat) / (1 - this._e * sinLat))) / 2
  }
  
  private W(sinLat: number) {
    return Math.sqrt(1 - this._e2 * Math.pow(sinLat, 2))
  }
  
  private degreeToRad(degree: number): number {
    return degree * Math.PI / 180
  }
  
  private radToDegree(rad: number): number {
    return rad * 180 / Math.PI
  }
}

export const lest97 = new LambertConformalConic(GRS_1980, 58, 59 + 20 / 60, 57 + 31 / 60 + 3.19415 / 60 / 60, 24, 500000, 6375000)
export const llcHolberg = new LambertConformalConic(GRS_1980, 35, 65, 52, 10, 4000000, 2800000)
