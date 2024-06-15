import { DBGuild, DBGuildToCreate, DBGuildToUpdate } from './DBGuild'
import { Guild, GuildToCreate, GuildToUpdate } from '../../../domain/models/guilds/Guild'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { IGuildProvider } from '../../../domain/providers/guilds/IGuildProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { DBCharacterClasse } from '../character_classes/DBCharacterClasse'
import { DBGuildMember } from '../guilds_members/DBGuildMember'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBGuildProvider implements IGuildProvider {
  private readonly logger = new Logger(DBGuild.name)
  constructor(
    @InjectRepository(DBGuild)
    private readonly guildRepository: Repository<DBGuild>,
    @InjectRepository(DBCharacterClasse)
    private readonly guildMembersRepository: Repository<DBGuildMember>
  ) {
    this.logger.log('Initialised')
  }

  async create(guild: GuildToCreate): Promise<Guild> {
    const toCreate: DBGuildToCreate = {
      createdDate: new Date(),
      updatedDate: new Date(),
      name: guild.name
    }
    const created = await this.guildRepository.create(toCreate)
    await this.guildRepository.insert(created)
    return await this.findOneById(created.id)
  }

  async findOneById(id: string): Promise<Guild> {
    const guild = await this.guildRepository.findOne({
      where: {
        id: id
      },
      relations: DBGuild.RELATIONS
    })
    if (!guild) {
      throw ProviderErrors.EntityNotFound(DBGuild.name)
    }
    return DBGuild.toGuild(guild)
  }

  async findAllPaginated(p: { accountId: string; pageOptions: PageOptions }): Promise<Page<Guild>> {
    const [res, total] = await this.guildRepository.findAndCount({
      relations: DBGuild.RELATIONS,
      take: p.pageOptions.perPage,
      skip: p.pageOptions.skip
    })
    return new Page({
      items: res.map(DBGuild.toGuild),
      pageOptions: p.pageOptions,
      total: total
    })
  }

  async update(p: { guildId: string; guild: Partial<GuildToUpdate> }): Promise<Guild> {
    const toUpdate: Partial<DBGuildToUpdate> = {
      name: p.guild.name,
      updatedDate: new Date()
    }
    await this.guildRepository.update(
      {
        id: p.guildId
      },
      toUpdate
    )
    return await this.findOneById(p.guildId)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.guildRepository.delete({
      id: id
    })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBGuild.name)
    }
  }
}
