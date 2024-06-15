import { DBGuild } from '../../../main/data/database/guilds/DBGuild'
import { Guild, GuildToCreate } from '../../../main/domain/models/guilds/Guild'
import { Chance } from 'chance'

export class TestGuildHelpers {
  static chance = new Chance()

  static generateGuildToCreate(): GuildToCreate {
    return {
      name: this.chance.string(),
      members: []
    }
  }

  static generateGuild(): Guild {
    return {
      members: [],
      id: this.chance.guid(),
      name: this.chance.string()
    }
  }

  static generateDBGuild(): DBGuild {
    return {
      createdDate: this.chance.date(),
      updatedDate: this.chance.date(),
      id: this.chance.guid(),
      name: this.chance.string(),
      members: []
    }
  }
}
