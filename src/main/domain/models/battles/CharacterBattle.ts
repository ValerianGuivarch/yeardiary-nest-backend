import { Character } from '../characters/Character'

export type CharacterBattle = {
  character: Character
}
export type CharacterBattleToCreate = Omit<CharacterBattle, 'character'> & {
  character: Pick<Character, 'id'>
}
