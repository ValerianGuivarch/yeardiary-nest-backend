import { DBCharacter } from '../../../main/data/database/characters/DBCharacter'
import { DBGuild } from '../../../main/data/database/guilds/DBGuild'
import { DBGuildMember } from '../../../main/data/database/guilds_members/DBGuildMember'
import { GuildRank } from '../../../main/domain/models/guilds/GuildRank'
import { Chance } from 'chance'

export class TestGuildMemberHelpers {
  static chance = new Chance()

  static generateDBGuildMember(linkedEntities: { character: DBCharacter; guild: DBGuild }): DBGuildMember {
    return {
      character: linkedEntities.character,
      characterId: linkedEntities.character.id,
      createdDate: this.chance.date(),
      guild: linkedEntities.guild,
      guildId: linkedEntities.guild.id,
      rank: GuildRank.MEMBER,
      updatedDate: this.chance.date()
    }
  }
}
