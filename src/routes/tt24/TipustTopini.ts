export interface Track {
  id:string
  color: string
  width: number
  coordinates: number[][]
}
export interface TipustTopini {
  name: string;
  tracks: Track[]
  styles: {
    id: string
    icon: string
  }[]
  Marks: {
    id: string
    name: string
    strokeColor: string
    fillColor: string
    icon: string
    coordinates: number[]
  }[]
}