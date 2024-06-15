import { GuildMemberVM } from './GuildMemberVM'
import { Guild } from '../../../../../../domain/models/guilds/Guild'
import { GuildRank } from '../../../../../../domain/models/guilds/GuildRank'
import { CharacterClasseVMExample } from '../../characters/entities/CharacterClasseVM'
import { CharacterVM } from '../../characters/entities/CharacterVM'
import { RaceVM, RaceVMExample } from '../../races/entities/RaceVM'
import { ApiProperty } from '@nestjs/swagger'

export class GuildVM {
  @ApiProperty({ description: 'The guild uuid', type: String, format: 'uuid' })
  id: string

  @ApiProperty({ description: 'The guild name', type: String })
  name: string

  @ApiProperty({
    isArray: true,
    description: 'All guild members',
    type: () => CharacterVM
  })
  members: CharacterWithoutGuildVM[]

  constructor(guild: GuildVM) {
    this.id = guild.id
    this.name = guild.name
    this.members = guild.members
  }

  static from(guild: Guild): GuildVM {
    return new GuildVM({
      id: guild.id,
      name: guild.name,
      members: guild.members.map((guildMember) => {
        return {
          id: guildMember.member.id,
          name: guildMember.member.name,
          level: guildMember.member.level,
          accountId: guildMember.member.linkedAccount.id,
          classes: guildMember.member.classes,
          rank: guildMember.rank,
          race: RaceVM.from(guildMember.member.race),
          currentLevel: guildMember.member.currentLevel
        }
      })
    })
  }
}

export type CharacterWithoutGuildVM = Omit<CharacterVM, 'guilds'> & GuildMemberVM

export const GuildVMExample: GuildVM = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'My guild',
  members: [
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'My guild',
      accountId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      classes: [CharacterClasseVMExample],
      race: RaceVMExample,
      level: 10,
      currentLevel: 10,
      rank: GuildRank.MEMBER
    }
  ]
}
