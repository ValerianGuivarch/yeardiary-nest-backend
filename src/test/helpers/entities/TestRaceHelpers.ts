import { DBDiary } from '../../../main/data/database/diaries/DBDiary'
import { Diary, RaceToCreate } from '../../../main/domain/models/diaries/Diary'
import { Size } from '../../../main/domain/models/diaries/Size'
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

  static generateRace(): Diary {
    return {
      id: this.chance.guid(),
      name: this.chance.string(),
      size: Size.MEDIUM,
      sleep: true
    }
  }

  static generateDBRace(): DBDiary {
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
