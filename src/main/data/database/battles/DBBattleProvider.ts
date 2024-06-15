import { DBBattle, DBBattleToCreate, DBBattleToUpdate } from './DBBattle'
import { Battle, BattleToCreate, BattleToUpdate } from '../../../domain/models/battles/Battle'
import { IBattleProvider } from '../../../domain/providers/battles/IBattleProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBBattleProvider implements IBattleProvider {
  private readonly logger = new Logger(DBBattleProvider.name)
  constructor(@InjectRepository(DBBattle) private readonly battleRepository: Repository<DBBattle>) {}

  async create(battleToCreate: BattleToCreate): Promise<Battle> {
    const toCreate: DBBattleToCreate = {
      alreadyActedCharacters: battleToCreate.alreadyActedCharacters,
      createdDate: new Date(),
      currentTurn: battleToCreate.currentTurn,
      strongElement: battleToCreate.strongElement,
      updatedDate: new Date(),
      weakElement: battleToCreate.weakElement,
      isOver: false
    }
    const created = await this.battleRepository.create(toCreate)
    await this.battleRepository.insert(created)
    return await this.findOneById(created.id)
  }

  async findOneById(id: string): Promise<Battle> {
    const res = await this.battleRepository.findOne({
      where: {
        id: id
      },
      relations: DBBattle.RELATIONS
    })
    if (!res) {
      throw ProviderErrors.EntityNotFound(DBBattle.name)
    }
    return DBBattle.toBattle(res)
  }

  async update(p: { battleId: string; battleToUpdate: Partial<BattleToUpdate> }): Promise<Battle> {
    const toUpdate: Partial<DBBattleToUpdate> = {
      alreadyActedCharacters: p.battleToUpdate.alreadyActedCharacters,
      currentTurn: p.battleToUpdate.currentTurn,
      strongElement: p.battleToUpdate.strongElement,
      updatedDate: new Date(),
      weakElement: p.battleToUpdate.weakElement,
      isOver: p.battleToUpdate.isBattleOver
    }
    await this.battleRepository.update(
      {
        id: p.battleId
      },
      toUpdate
    )
    return await this.findOneById(p.battleId)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.battleRepository.delete({ id: id })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBBattle.name)
    }
  }
}
