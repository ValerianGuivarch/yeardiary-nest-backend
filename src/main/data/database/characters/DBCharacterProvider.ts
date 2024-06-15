import { DBCharacter, DBCharacterToCreate, DBCharacterToUpdate } from './DBCharacter'
import { Character, CharacterToCreate, CharacterToUpdate } from '../../../domain/models/characters/Character'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { ICharacterProvider } from '../../../domain/providers/characters/ICharacterProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class DBCharacterProvider implements ICharacterProvider {
  private readonly logger = new Logger(DBCharacter.name)
  constructor(
    @InjectRepository(DBCharacter)
    private readonly characterRepository: Repository<DBCharacter>
  ) {
    this.logger.log('Initialised')
  }

  async create(character: CharacterToCreate): Promise<Character> {
    const toCreate: DBCharacterToCreate = {
      accountId: character.linkedAccount.id,
      createdDate: new Date(),
      updatedDate: new Date(),
      invokerId: character.linkedInvoker?.id,
      level: character.level,
      name: character.name,
      raceId: character.race.id,
      damageTaken: character.damageTaken
    }
    const created = this.characterRepository.create(toCreate)
    await this.characterRepository.insert(created)
    return await this.findOneById(created.id)
  }

  async findOneById(id: string): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: {
        id: id
      },
      relations: DBCharacter.RELATIONS
    })
    if (!character) {
      throw ProviderErrors.EntityNotFound(DBCharacter.name)
    }
    return DBCharacter.toCharacter(character)
  }

  async findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Character>> {
    const [res, total] = await this.characterRepository.findAndCount({
      relations: DBCharacter.RELATIONS,
      take: p.pageOptions.perPage,
      skip: p.pageOptions.skip,
      order: { name: p.pageOptions.order }
    })
    return new Page({
      items: res.map(DBCharacter.toCharacter),
      pageOptions: p.pageOptions,
      total: total
    })
  }

  async findAllByAccountIdPaginated(p: { accountId: string; pageOptions: PageOptions }): Promise<Page<Character>> {
    const [res, total] = await this.characterRepository.findAndCount({
      where: {
        accountId: p.accountId
      },
      relations: DBCharacter.RELATIONS,
      take: p.pageOptions.perPage,
      order: { name: p.pageOptions.order },
      skip: p.pageOptions.skip
    })
    return new Page({
      items: res.map(DBCharacter.toCharacter),
      pageOptions: p.pageOptions,
      total: total
    })
  }

  async update(p: { characterId: string; character: Partial<CharacterToUpdate> }): Promise<Character> {
    const toUpdate: Partial<DBCharacterToUpdate> = {
      level: p.character.level,
      name: p.character.name,
      picture: p.character.picture,
      updatedDate: new Date()
    }
    await this.characterRepository.update(
      {
        id: p.characterId
      },
      toUpdate
    )
    return await this.findOneById(p.characterId)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.characterRepository.delete({
      id: id
    })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBCharacter.name)
    }
  }
}
