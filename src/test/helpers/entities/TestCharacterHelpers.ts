import { TestRaceHelpers } from './TestRaceHelpers'
import { DBAccount } from '../../../main/data/database/accounts/DBAccount'
import { DBCharacter } from '../../../main/data/database/characters/DBCharacter'
import { DBRace } from '../../../main/data/database/races/DBRace'
import { Character, CharacterToCreate, CharacterToUpdate } from '../../../main/domain/models/characters/Character'
import { Chance } from 'chance'

export class TestCharacterHelpers {
  static chance = new Chance()

  static generateCharacterToCreate(): CharacterToCreate {
    return {
      linkedAccount: {
        id: this.chance.guid()
      },
      linkedInvoker: undefined,
      level: this.chance.integer({ min: 1, max: 20 }),
      name: this.chance.name(),
      race: {
        id: this.chance.guid()
      },
      guilds: [],
      classes: [],
      picture: undefined,
      damageTaken: 0
    }
  }

  static generateCharacterToUpdate(): CharacterToUpdate {
    return {
      damageTaken: 0,
      picture: this.chance.string(),
      level: this.chance.integer({ min: 1, max: 20 }),
      name: this.chance.name()
    }
  }

  static generateCharacter(): Character {
    return {
      linkedAccount: {
        id: this.chance.guid()
      },
      classes: [],
      guilds: [],
      id: this.chance.guid(),
      linkedInvoker: undefined,
      level: this.chance.integer({ min: 1, max: 20 }),
      currentLevel: this.chance.integer({ min: 1, max: 20 }),
      currentHp: this.chance.integer({ min: 1, max: 20 }),
      totalLife: this.chance.integer({ min: 1, max: 20 }),
      name: this.chance.name(),
      picture: undefined,
      race: TestRaceHelpers.generateRace(),
      damageTaken: 0
    }
  }

  static generateDBCharacter(linkedEntities: { account: DBAccount; race: DBRace }): DBCharacter {
    return {
      account: undefined,
      accountId: linkedEntities.account.id,
      characterClasses: [],
      createdDate: this.chance.date(),
      guilds: [],
      id: this.chance.guid(),
      invoker: undefined,
      invokerId: undefined,
      level: this.chance.integer({ min: 1, max: 20 }),
      name: this.chance.name(),
      picture: this.chance.string(),
      race: linkedEntities.race,
      raceId: linkedEntities.race.id,
      updatedDate: this.chance.date(),
      damageTaken: 0,
      items: []
    }
  }
}
