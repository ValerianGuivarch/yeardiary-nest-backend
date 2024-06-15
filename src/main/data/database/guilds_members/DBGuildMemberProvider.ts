import { DBGuildMember } from './DBGuildMember'
import { GuildMember, GuildMemberToCreate, GuildMemberToUpdate } from '../../../domain/models/guilds/GuildMember'
import { IGuildMemberProvider } from '../../../domain/providers/guilds/IGuildMemberProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

@Injectable()
export class DBGuildMemberProvider implements IGuildMemberProvider {
  private readonly logger = new Logger(DBGuildMember.name)
  constructor(
    @InjectRepository(DBGuildMember)
    private readonly guildMemberRepository: Repository<DBGuildMember>
  ) {
    this.logger.log('Initialised')
  }

  async create(guildMember: GuildMemberToCreate): Promise<GuildMember> {
    const toCreate = {
      createdDate: new Date(),
      updatedDate: new Date(),
      guildId: guildMember.guild.id,
      characterId: guildMember.character.id,
      rank: guildMember.rank
    }

    const created = this.guildMemberRepository.create(toCreate)
    await this.guildMemberRepository.insert(created)
    return this.findOneByGuildIdAndCharacterId({
      guildId: created.guildId,
      characterId: created.characterId
    })
  }

  private async findOneByGuildIdAndCharacterId(p: { guildId: string; characterId: string }): Promise<GuildMember> {
    const dbGuildMember = await this.guildMemberRepository.findOne({
      where: {
        guildId: p.guildId,
        characterId: p.characterId
      },
      relations: DBGuildMember.RELATIONS
    })
    if (!dbGuildMember) {
      throw ProviderErrors.EntityNotFound(DBGuildMember.name)
    }
    return DBGuildMember.toGuildMember(dbGuildMember)
  }

  async delete(p: { guildId: string; characterIds: string[] }): Promise<void> {
    await this.guildMemberRepository.delete({
      guildId: p.guildId,
      characterId: In(p.characterIds)
    })
  }

  async update(p: { characterId: string; guildId: string; guildMember: GuildMemberToUpdate }): Promise<GuildMember> {
    const toUpdate = {
      updatedDate: new Date(),
      rank: p.guildMember.rank
    }
    await this.guildMemberRepository.update(
      {
        guildId: p.guildId,
        characterId: p.characterId
      },
      toUpdate
    )
    return this.findOneByGuildIdAndCharacterId({
      guildId: p.guildId,
      characterId: p.characterId
    })
  }
}
