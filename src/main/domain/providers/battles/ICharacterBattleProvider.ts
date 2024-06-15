import { CharacterBattle, CharacterBattleToCreate } from '../../models/battles/CharacterBattle'

export interface ICharacterBattleProvider {
  create(battleId: string, characterBattle: CharacterBattleToCreate): Promise<CharacterBattle>
  deleteByBattleIdAndCharacterId(battleId: string, characterId: string): Promise<void>
}
