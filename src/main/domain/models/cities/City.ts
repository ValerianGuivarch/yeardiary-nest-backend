import { PointOfInterest } from './PointOfInterest'

export class City {
  id: string
  name: string
  pointsOfInterest: PointOfInterest[]

  constructor(p: { id: string; name: string; pointsOfInterest: PointOfInterest[] }) {
    this.id = p.id
    this.name = p.name
    this.pointsOfInterest = p.pointsOfInterest
  }
}
