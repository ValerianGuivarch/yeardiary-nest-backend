import { GuildMember, GuildMemberToCreate, GuildMemberToUpdate } from '../../models/guilds/GuildMember'

export interface IGuildMemberProvider {
  create(guild: GuildMemberToCreate): Promise<GuildMember>
  update(p: { characterId: string; guildId: string; guildMember: GuildMemberToUpdate }): Promise<GuildMember>
  delete(p: { guildId: string; characterIds: string[] }): Promise<void>
}
