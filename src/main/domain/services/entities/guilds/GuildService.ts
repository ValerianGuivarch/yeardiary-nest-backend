import { Account } from '../../../models/accounts/Account'
import { Guild, GuildToCreate, GuildToUpdate } from '../../../models/guilds/Guild'
import { GuildMemberToCreate, GuildMemberToUpdate } from '../../../models/guilds/GuildMember'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { IGuildMemberProvider } from '../../../providers/guilds/IGuildMemberProvider'
import { IGuildProvider } from '../../../providers/guilds/IGuildProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class GuildService {
  private readonly logger = new Logger(GuildService.name)
  constructor(
    @Inject('IGuildProvider') private readonly guildProvider: IGuildProvider,
    @Inject('IGuildMemberProvider') private readonly guildMemberProvider: IGuildMemberProvider
  ) {
    this.logger.log('Initialised')
  }
  async createGuild(guildToCreate: GuildToCreate): Promise<Guild> {
    return await this.guildProvider.create(guildToCreate)
  }

  async getGuildById(id: string): Promise<Guild> {
    return await this.guildProvider.findOneById(id)
  }

  async getAllGuildsPaginated(p: { account: Account; pageOptions: PageOptions }): Promise<Page<Guild>> {
    return await this.guildProvider.findAllPaginated({
      pageOptions: p.pageOptions
    })
  }

  async updateGuild(p: { guildId: string; guild: Partial<GuildToUpdate> }): Promise<Guild> {
    return await this.guildProvider.update({ guildId: p.guildId, guild: p.guild })
  }

  async deleteOneGuild(id: string): Promise<void> {
    await this.guildProvider.deleteOneById(id)
  }

  async addMembersToGuild(memberToCreate: GuildMemberToCreate): Promise<Guild> {
    const guildMember = await this.guildMemberProvider.create(memberToCreate)
    return this.getGuildById(guildMember.guild.id)
  }

  async removeMember(p: { guildId: string; characterIds: string[] }): Promise<Guild> {
    await this.guildMemberProvider.delete({
      guildId: p.guildId,
      characterIds: p.characterIds
    })
    return this.getGuildById(p.guildId)
  }

  async updateGuildMember(p: {
    guildId: string
    characterId: string
    memberToUpdate: GuildMemberToUpdate
  }): Promise<Guild> {
    const guildMember = await this.guildMemberProvider.update({
      guildId: p.guildId,
      characterId: p.characterId,
      guildMember: p.memberToUpdate
    })
    return this.getGuildById(guildMember.guild.id)
  }
}
