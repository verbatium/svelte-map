//PROJCS["Estonia_1997_Estonia_National_Grid",
//     GEOGCS["GCS_Estonia_1997",
//         DATUM["D_Estonia_1997",
//             SPHEROID["GRS_1980",6378137.0,298.257222101]],
//         PRIMEM["Greenwich",0.0],
//         UNIT["Degree",0.0174532925199433]],
//     PROJECTION["Lambert_Conformal_Conic"],
//     PARAMETER["False_Easting",500000.0],
//     PARAMETER["False_Northing",6375000.0],
//     PARAMETER["Central_Meridian",24.0],
//     PARAMETER["Standard_Parallel_1",59.3333333333333],
//     PARAMETER["Standard_Parallel_2",58.0],
//     PARAMETER["Latitude_Of_Origin",57.5175539305556],
//     UNIT["Meter",1.0]]

interface Spheroid {
  name: string
  a: number
  inverseF: number
}

interface Projection {
  get name(): string
  
  directConversion(lat: number, lon: number): number[]
  
  inverseConversion(x: number, y: number): number[]
}

const GRS_1980: Spheroid = {
  name: 'GRS_1980',
  a: 6378137,
  inverseF: 298.257222101,
}

export class Lest97 implements Projection {
  private _lcc: LambertConformalConic
  
  constructor() {
    this._lcc = new LambertConformalConic(GRS_1980, 58, 59 + 20 / 60, 57 + 31 / 60 + 3.19415 / 60 / 60, 24, 500000, 6375000)
  }
  
  directConversion(lat: number, lon: number): number[] {
    return this._lcc.directConversion(lat, lon)
  }
  
  inverseConversion(x: number, y: number): number[] {
    return this._lcc.inverseConversion(x, y)
  }
  
  get name(): string {
    return 'Estonia_1997_Estonia_National_Grid'
  }
}

export class LambertConformalConic2 implements Projection {
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
  private _p0: number
  private _n: number
  private _F: number
  
  constructor(spheroid: Spheroid, lowerParallel: number, upperParallel: number, latitudeGridOrigin: number, longitudeGridOrigin: number, falseEasting: number, falseNorting: number) {
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
    
    
    const mu = this.m(this._Bu)
    const ml = this.m(this._Bl)
    //const mb = this.m(this._Bb)
    const tu = this.t(this._Bu)
    const tl = this.t(this._Bl)
    const tb = this.t(this._Bb)
    
    this._n = (Math.log(mu) - Math.log(ml)) / (Math.log(tu) - Math.log(tl))
    this._F = mu / (this._n * Math.pow(tu, this._n))
    this._p0 = this._spheroid.a*this._F*Math.pow(tb,this._n)
  }
  
  t(b: number): number {
    const esinB = this._e * this.sin(b)
    return Math.tan(Math.PI / 4 - b / 4) / Math.pow((1 - esinB) / (1 + esinB), this._e / 2)
  }
  
  m(b: number): number {
    return this.cos(b) / Math.sqrt(1 - this._e2 * Math.pow(this.sin(b), 2))
  }
  
  get name(): string {
    return 'Lambert_Conformal_Conic'
  }
  
  inverseConversion(E: number, N: number): number[] {
    const Ni = N - this._N0
    const Ei = (this._E0 - E)
    const pi =Math.sqrt(Math.pow(Ei,2)+Math.pow(this._p0-Ni, 2)) * Math.sign(this._n)
    const ti = Math.pow(pi/(this._spheroid.a*this._F),1/this._n)
    const yi=Math.atan(Ei/(this._p0-Ni))
    
    let  B = Math.PI/2 - 2* Math.atan(ti)
    B= Math.PI/2 - 2* Math.atan(ti* Math.pow((1-this._e* this.sin(B))/(1+this._e* this.sin(B)), this._e/2))
    const L = yi/this._n + this._L0
    
    return [this.radToDegree(B), this.radToDegree(L)]
    
    /*
    The reverse formulas to derive the latitude and longitude of a point from its Easting and Northing values are:

lat = pi/2 - 2arctan{t'[(1 - esin(lat))/(1 + esin(lat))]^(e/2)}
lon = theta'/n +lon0
where
r' = +/-[(E - EF)^2 + {rF - (N - NF)}^2]^0.5 , taking the sign of n
t' = (r'/(aF))^(1/n)
theta' = atan2 [(E- EF),(rF - (N- NF))]
(see implementation notes in GN7-2 preface for atan2 convention)
and n, F, and rF are derived as for the forward calculation.

Note that the formula for lat requires iteration. First calculate t' and then a trial value for lat using
lat = π/2-2atan(t'). Then use the full equation for lat substituting the trial value into the right hand side of the equation. Thus derive a new value for lat. Iterate the process until lat does not change significantly. The solution should quickly converge, in 3 or 4 iterations.
     */
  }

// φ parallel of geodetic latitude, positive North
// λ meridian of geodetic longitude, positive East
  directConversion(B: number, L: number): number[] {
    /*
    Note: These formulas have been transcribed from EPSG Guidance Note #7-2. Users are encouraged to use that document rather than the text which follows as reference because limitations in the transcription will be avoided.

To derive the projected Easting and Northing coordinates of a point with geographical coordinates (lat,lon) the formulas for the one standard parallel case are:

E = EF + r sin(theta)
N = NF + rF - r cos(theta)
where
m = cos(lat)/(1 - e^2 sin^2(lat))^0.5     for m1, lat1, and m2, lat2 where lat1 and lat2 are the latitudes of the two standard parallels.
t  = tan(pi/4 - lat/2)/[(1 - e sin(lat))/(1 + e sin(lat))]^(e/2)   for t1, t2, tF and t using lat1, lat2, latF and lat respectively.
n = (loge(m1) - loge(m2))/(loge(t1) - loge(t2))
F = m1/(n  t1^n)
r =  a F t^n         for rF and r, where rF is the radius of the parallel of latitude of the false origin.
theta = n(lon - lon0)
     */
    return [B, L]
  }
  
  // Q isometric latitude
  private Q(sinLat: number) {
    return (Math.log((1 + sinLat) / (1 - sinLat)) - this._e * Math.log((1 + this._e * sinLat) / (1 - this._e * sinLat))) / 2
  }
  
  private W(sinB: number) {
    return Math.sqrt(1 - this._e2 * Math.pow(sinB, 2))
  }
  
  private sin(angleDegrees: number): number {
    return Math.sin((angleDegrees))
  }
  
  private cos(angleDegrees: number): number {
    return Math.cos((angleDegrees))
  }
  
  private degreeToRad(degree: number): number {
    return degree * Math.PI / 180
  }
  
  private radToDegree(rad: number): number {
    return rad * 180 / Math.PI
  }
  
  // private correction(sinB: number): number {
  //   const f1 = this.Q(sinB)
  //   const sin2B = Math.pow(sinB, 2)
  //   const f2 = (1 / (1 - sin2B)) - (this._e2 / (1 - this._e2 * sin2B))
  //   let error = this.degreeToRad(f1 / f2)
  //   console.log('sinB', sinB, 'F1', f1, 'F2', f2, 'f1/f2', error)
  //   return error
  // }
}

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
  
  constructor(spheroid: Spheroid, lowerParallel: number, upperParallel: number, latitudeGridOrigin: number, longitudeGridOrigin: number, falseEasting: number, falseNorting: number) {
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
    
    const sinBu = this.sin(this._Bu)
    const Qu = this.Q(sinBu)
    const Wu = this.W(sinBu)
    
    const sinBl = this.sin(this._Bl)
    const Ql = this.Q(sinBl)
    const Wl = this.W(sinBl)
    const sinBb = this.sin(this._Bb)
    const Qb = this.Q(sinBb)
    // const Wb = this.W(sinBb)
    
    this._sinB0 = Math.log(Wu * this.cos(this._Bl) / (Wl * this.cos(this._Bu))) / (Qu - Ql)
// K mapping radius at the equator
    this._K = this._spheroid.a * this.cos(this._Bl) * Math.exp(Ql * this._sinB0) / (Wl * this._sinB0)

// R mapping radius at latitude φ
    this._R0 = this._K / Math.exp(Qb * this._sinB0)
  }
  
  get name(): string {
    return 'Lambert_Conformal_Conic'
  }
  
  inverseConversion(E: number, N: number): number[] {
    const Ri = (this._R0 - N + this._N0)
    const Ei = (this._E0 - E)
    // γ convergence angle
    const y = Math.atan(Ei / Ri)
    const L = this._L0 - y / this._sinB0
    const R = Math.sqrt(Math.pow(Ri, 2) + Math.pow(Ei, 2))
    const q = Math.log(this._K / R) / this._sinB0
    const sinB = (Math.exp(2 * q) - 1) / (Math.exp(2 * q) + 1)
    //let error = this.correction(sinB)
    // while (Math.abs(error) >d 0.00001) {
    //   sinB += error
    //   error = this.correction(sinB)
    // }
    return [this.radToDegree(Math.asin(sinB)), this.radToDegree(L)]
  }

// φ parallel of geodetic latitude, positive North
// λ meridian of geodetic longitude, positive East
  directConversion(B: number, L: number): number[] {
    //Input geodetic coordinates of point P(B, L)
    //Output: grid coordinates of point P(E,N), convergence angle y, scale factor k
    const sinB = this.sin(B)
    const q = this.Q(sinB)
    const R = this._K / Math.exp(q * this._sinB0)
    // γ convergence angle
    const y = (this._L0 - L) * this._sinB0
    const E = this._E0 - R * this.sin(y)
    const N = this._R0 + this._N0 - R * this.cos(y)
    // k grid scale factor at a general point
    const k = this.W(sinB) * R * this._sinB0 / (this._spheroid.a * this.cos(B))
    return [E, N]
  }
  
  // Q isometric latitude
  private Q(sinLat: number) {
    return (Math.log((1 + sinLat) / (1 - sinLat)) - this._e * Math.log((1 + this._e * sinLat) / (1 - this._e * sinLat))) / 2
  }
  
  private W(sinB: number) {
    return Math.sqrt(1 - this._e2 * Math.pow(sinB, 2))
  }
  
  private sin(angleDegrees: number): number {
    return Math.sin((angleDegrees))
  }
  
  private cos(angleDegrees: number): number {
    return Math.cos((angleDegrees))
  }
  
  private degreeToRad(degree: number): number {
    return degree * Math.PI / 180
  }
  
  private radToDegree(rad: number): number {
    return rad * 180 / Math.PI
  }
  
  // private correction(sinB: number): number {
  //   const f1 = this.Q(sinB)
  //   const sin2B = Math.pow(sinB, 2)
  //   const f2 = (1 / (1 - sin2B)) - (this._e2 / (1 - this._e2 * sin2B))
  //   let error = this.degreeToRad(f1 / f2)
  //   console.log('sinB', sinB, 'F1', f1, 'F2', f2, 'f1/f2', error)
  //   return error
  // }
}

// E easting coordinate
// N northing coordinate
//Constants and expressions within Lamberts;s conical mappping equations are ellipsoid and zone specific

export const lest97 = new Lest97()
const llc = new LambertConformalConic2(GRS_1980, 35, 65, 52, 10, 4_000_000, 2_800_000)
