import { DBRace } from '../../../main/data/database/races/DBRace'
import { Race, RaceToCreate } from '../../../main/domain/models/races/Race'
import { Size } from '../../../main/domain/models/races/Size'
import { Chance } from 'chance'

export class TestRaceHelpers {
  static chance = new Chance()

  static generateRaceToCreate(): RaceToCreate {
    return {
      name: this.chance.string(),
      size: Size.MEDIUM,
      sleep: true
    }
  }

  static generateRace(): Race {
    return {
      id: this.chance.guid(),
      name: this.chance.string(),
      size: Size.MEDIUM,
      sleep: true
    }
  }

  static generateDBRace(): DBRace {
    return {
      createdDate: this.chance.date(),
      updatedDate: this.chance.date(),
      id: this.chance.guid(),
      name: this.chance.string(),
      size: Size.MEDIUM,
      sleep: true
    }
  }
}
