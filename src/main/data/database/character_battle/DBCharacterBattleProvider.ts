import { DBCharacterBattle, DBCharacterBattleToCreate } from './DBCharacterBattle'
import { CharacterBattle, CharacterBattleToCreate } from '../../../domain/models/battles/CharacterBattle'
import { ICharacterBattleProvider } from '../../../domain/providers/battles/ICharacterBattleProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBCharacterBattleProvider implements ICharacterBattleProvider {
  private readonly logger = new Logger(DBCharacterBattleProvider.name)
  constructor(@InjectRepository(DBCharacterBattle) private readonly battleRepository: Repository<DBCharacterBattle>) {}

  async create(battleId: string, characterBattleToCreate: CharacterBattleToCreate): Promise<CharacterBattle> {
    const toCreate: DBCharacterBattleToCreate = {
      createdDate: new Date(),
      updatedDate: new Date(),
      battleId: battleId,
      characterId: characterBattleToCreate.character.id
    }
    const created = await this.battleRepository.create(toCreate)
    await this.battleRepository.insert(created)
    return await this.findOneByBattleIdAndCharacterId(created.battleId, created.characterId)
  }

  async findOneByBattleIdAndCharacterId(battleId: string, characterId: string): Promise<CharacterBattle> {
    const res = await this.battleRepository.findOne({
      where: {
        battleId: battleId,
        characterId: characterId
      },
      relations: DBCharacterBattle.RELATIONS
    })
    if (!res) {
      throw ProviderErrors.EntityNotFound(DBCharacterBattle.name)
    }
    return DBCharacterBattle.toCharacterBattle(res)
  }

  async deleteByBattleIdAndCharacterId(battleId: string, characterId: string): Promise<void> {
    await this.battleRepository.delete({ battleId: battleId, characterId: characterId })
  }
}
