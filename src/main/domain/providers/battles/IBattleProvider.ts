import { Battle, BattleToCreate, BattleToUpdate } from '../../models/battles/Battle'

export interface IBattleProvider {
  create(battleToCreate: BattleToCreate): Promise<Battle>
  findOneById(id: string): Promise<Battle>
  update(p: { battleId: string; battleToUpdate: Partial<BattleToUpdate> }): Promise<Battle>
  deleteOneById(id: string): Promise<void>
}
