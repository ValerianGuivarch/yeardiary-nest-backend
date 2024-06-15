import { Guild } from './Guild'
import { GuildRank } from './GuildRank'
import { Character } from '../characters/Character'

export type GuildMember = {
  guild: GuildWithoutMember
  member: CharacterWithoutGuild
  rank: GuildRank
}

export type GuildMemberToCreate = Omit<GuildMember, 'guild' | 'member'> & {
  guild: Pick<Guild, 'id'>
  character: Pick<Character, 'id'>
}

export type GuildMemberToUpdate = Pick<GuildMember, 'rank'>
export type GuildWithoutMember = Omit<Guild, 'members'>
export type CharacterWithoutGuild = Omit<Character, 'guilds'>
