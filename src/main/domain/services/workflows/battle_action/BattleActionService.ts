import { DomainErrors } from '../../../errors/DomainErrors'
import { Battle } from '../../../models/battles/Battle'
import { BattleService } from '../../entities/battles/BattleService'
import { CharacterService } from '../../entities/characters/CharacterService'
import { SkillService } from '../../entities/skills/SkillService'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class BattleActionService {
  private readonly logger = new Logger(BattleActionService.name)

  constructor(
    private readonly characterService: CharacterService,
    private readonly battleService: BattleService,
    private readonly skillService: SkillService
  ) {}

  async useOffensiveSkill(p: { userId: string; targetId: string; skillId: string; battleId: string }): Promise<Battle> {
    const battle = await this.battleService.getOneBattleById(p.battleId)
    if (battle.alreadyActedCharacters.includes(p.userId)) {
      throw DomainErrors.characterHasAlreadyActed()
    }
    if (!battle.characters.some((character) => character.character.id === p.userId)) {
      throw DomainErrors.actingCharacterNotInBattle()
    }
    if (!battle.characters.some((character) => character.character.id === p.targetId)) {
      throw DomainErrors.targetCharacterNotInBattle()
    }
    const targetCharacter = await this.characterService.getCharacterById(p.targetId)
    const skill = await this.skillService.getOneById(p.skillId)
    await this.characterService.assignDamageToCharacter({
      character: targetCharacter,
      damage: await this.battleService.computeSkillDamage({ skill: skill, battle: battle }),
      skill: skill
    })
    battle.alreadyActedCharacters.push(p.userId)
    if (battle.alreadyActedCharacters.length === battle.characters.length) {
      battle.alreadyActedCharacters = []
      battle.currentTurn = battle.currentTurn + 1
    }
    return await this.battleService.updateBattle({
      battleId: p.battleId,
      battleToUpdate: { alreadyActedCharacters: battle.alreadyActedCharacters, currentTurn: battle.currentTurn }
    })
  }
}
