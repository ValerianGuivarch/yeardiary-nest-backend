import { DBCharacterClasse, DBCharacterClasseToCreate, DBCharacterClasseToUpdate } from './DBCharacterClasse'
import {
  CharacterClasse,
  CharacterClasseToCreate,
  CharacterClasseToUpdate
} from '../../../domain/models/characters/CharacterClasse'
import { ICharacterClasseProvider } from '../../../domain/providers/characters/ICharacterClasseProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBCharacterClasseProvider implements ICharacterClasseProvider {
  private readonly logger = new Logger(DBCharacterClasse.name)
  constructor(
    @InjectRepository(DBCharacterClasse)
    private readonly characterClasseRepository: Repository<DBCharacterClasse>
  ) {
    this.logger.log('Initialised')
  }

  async create(characterId: string, characterClasse: CharacterClasseToCreate): Promise<CharacterClasse> {
    const toCreate: DBCharacterClasseToCreate = {
      classeId: characterClasse.classe.id,
      characterId: characterId,
      level: characterClasse.level
    }
    const created = this.characterClasseRepository.create(toCreate)
    await this.characterClasseRepository.insert(created)
    return this.findOneByCharacterIdAndClasseId({
      characterId: created.characterId,
      classeId: created.classeId
    })
  }

  private async findOneByCharacterIdAndClasseId(p: {
    characterId: string
    classeId: string
  }): Promise<CharacterClasse> {
    const dbCharacterClasse = await this.characterClasseRepository.findOne({
      where: {
        characterId: p.characterId,
        classeId: p.classeId
      },
      relations: DBCharacterClasse.RELATIONS
    })
    if (!dbCharacterClasse) {
      throw ProviderErrors.EntityNotFound(DBCharacterClasseProvider.name)
    }
    return DBCharacterClasse.toCharacterClasse(dbCharacterClasse)
  }

  async update(p: {
    characterId: string
    classeId: string
    characterClasse: CharacterClasseToUpdate
  }): Promise<CharacterClasse> {
    const toUpdate: DBCharacterClasseToUpdate = {
      level: p.characterClasse.level,
      updatedDate: new Date()
    }
    await this.characterClasseRepository.update(
      {
        characterId: p.characterId,
        classeId: p.classeId
      },
      toUpdate
    )
    return this.findOneByCharacterIdAndClasseId({
      characterId: p.characterId,
      classeId: p.classeId
    })
  }

  async deleteByCharacterIdAndClasseId(p: { characterId: string; classeId: string }): Promise<void> {
    await this.characterClasseRepository.delete({
      characterId: p.characterId,
      classeId: p.classeId
    })
  }
}
