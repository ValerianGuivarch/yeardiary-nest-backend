import { Size } from './Size'

export class Race {
  id: string
  name: string
  sleep: boolean
  size: Size

  constructor(race: Race) {
    this.id = race.id
    this.name = race.name
    this.sleep = race.sleep
    this.size = race.size
  }

  static toRaceToCreate(p: { name: string; sleep: boolean; size: Size }): RaceToCreate {
    return {
      name: p.name,
      sleep: p.sleep,
      size: p.size
    }
  }
}

export type RaceToCreate = Omit<Race, 'id'>
export type RaceToUpdate = Pick<Race, 'name' | 'sleep' | 'size'>
