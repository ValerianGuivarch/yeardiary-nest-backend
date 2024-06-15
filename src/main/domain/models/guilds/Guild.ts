import { GuildMember } from './GuildMember'

export class Guild {
  id: string
  name: string
  members: GuildMemberWithoutGuild[]

  constructor(guild: Guild) {
    this.id = guild.id
    this.name = guild.name
    this.members = guild.members
  }

  static toGuildToCreate(p: { name: string }): GuildToCreate {
    return {
      name: p.name,
      members: []
    }
  }
}
export type GuildToCreate = Omit<Guild, 'id'>
export type GuildToUpdate = Pick<Guild, 'name'>

export type GuildMemberWithoutGuild = Omit<GuildMember, 'guild'>
