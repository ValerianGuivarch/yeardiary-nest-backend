import { CharacterBattle } from './CharacterBattle'
import { MagicElement } from '../skills/MagicElement'

export class Battle {
  id: string
  characters: CharacterBattle[]
  currentTurn: number
  alreadyActedCharacters: string[]
  strongElement: MagicElement
  weakElement: MagicElement
  get isBattleOver(): boolean {
    return this.characters.filter((character) => character.character.currentHp > 0).length < 2
  }

  constructor(battle: {
    id: string
    characters: CharacterBattle[]
    alreadyActedCharacters: string[]
    currentTurn: number
    strongElement: MagicElement
    weakElement: MagicElement
  }) {
    this.id = battle.id
    this.characters = battle.characters
    this.alreadyActedCharacters = battle.alreadyActedCharacters
    this.currentTurn = battle.currentTurn
    this.strongElement = battle.strongElement
    this.weakElement = battle.weakElement
  }

  static toBattleToCreate(p: { strongElement: MagicElement; weakElement: MagicElement }): BattleToCreate {
    return {
      alreadyActedCharacters: [],
      strongElement: p.strongElement,
      weakElement: p.weakElement,
      currentTurn: 0
    }
  }
}

export type BattleToCreate = Omit<Battle, 'id' | 'characters' | 'isBattleOver'>
export type BattleToUpdate = Pick<
  Battle,
  'currentTurn' | 'strongElement' | 'weakElement' | 'alreadyActedCharacters' | 'isBattleOver'
>
