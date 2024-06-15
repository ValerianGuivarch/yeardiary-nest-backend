import { Battle, BattleToCreate, BattleToUpdate } from '../../../models/battles/Battle'
import { CharacterBattle, CharacterBattleToCreate } from '../../../models/battles/CharacterBattle'
import { Skill } from '../../../models/skills/Skill'
import { SkillMagical } from '../../../models/skills/SkillMagical'
import { IBattleProvider } from '../../../providers/battles/IBattleProvider'
import { ICharacterBattleProvider } from '../../../providers/battles/ICharacterBattleProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class BattleService {
  private readonly logger = new Logger(BattleService.name)
  constructor(
    @Inject('IBattleProvider') private readonly battleProvider: IBattleProvider,
    @Inject('ICharacterBattleProvider') private readonly characterBattleProvider: ICharacterBattleProvider
  ) {}

  async createBattle(battleToCreate: BattleToCreate): Promise<Battle> {
    return await this.battleProvider.create(battleToCreate)
  }

  async getOneBattleById(battleId: string): Promise<Battle> {
    return await this.battleProvider.findOneById(battleId)
  }

  async updateBattle(p: { battleId: string; battleToUpdate: Partial<BattleToUpdate> }): Promise<Battle> {
    return await this.battleProvider.update({
      battleId: p.battleId,
      battleToUpdate: p.battleToUpdate
    })
  }

  async deleteOneBattleById(id: string): Promise<void> {
    await this.battleProvider.deleteOneById(id)
  }

  async addCharacterToBattle(battleId: string, characterId: string): Promise<CharacterBattle> {
    const characterBattleToCreate: CharacterBattleToCreate = {
      character: { id: characterId }
    }
    return await this.characterBattleProvider.create(battleId, characterBattleToCreate)
  }

  async removeCharacterFromBattle(battleId: string, characterId: string): Promise<void> {
    await this.characterBattleProvider.deleteByBattleIdAndCharacterId(battleId, characterId)
  }

  async computeSkillDamage(p: { battle: Battle; skill: Skill }): Promise<number> {
    let damage = p.skill.damage
    if (SkillMagical.isSkillMagical(p.skill)) {
      if (p.battle.strongElement === p.skill.element) {
        damage = damage * 2
      }
      if (p.battle.weakElement === p.skill.element) {
        damage = damage / 2
      }
    }
    return damage
  }
}
