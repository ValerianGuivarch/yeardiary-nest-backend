import { CharacterBattleVM, CharacterBattleVMExample } from './CharacterBattleVM'
import { Battle } from '../../../../../../domain/models/battles/Battle'
import { MagicElement } from '../../../../../../domain/models/skills/MagicElement'
import { ApiProperty } from '@nestjs/swagger'

export class BattleVM {
  @ApiProperty({
    description: 'The battle uuid',
    type: String,
    format: 'uuid'
  })
  id: string

  @ApiProperty({
    description: 'The characters that are in the battle',
    type: CharacterBattleVM,
    isArray: true
  })
  characters: CharacterBattleVM[]

  @ApiProperty({
    description: 'The battle current turn',
    type: Number
  })
  currentTurn: number

  @ApiProperty({
    description: 'The character that have already acted during the current turn',
    type: String,
    isArray: true,
    format: 'uuid'
  })
  alreadyActedCharacters: string[]

  @ApiProperty({
    description: 'The battle strong magic element',
    enum: MagicElement,
    enumName: 'MagicElement'
  })
  strongElement: MagicElement

  @ApiProperty({
    description: 'The battle weak magic element',
    enum: MagicElement,
    enumName: 'MagicElement'
  })
  weakElement: MagicElement

  constructor(battle: BattleVM) {
    this.id = battle.id
    this.currentTurn = battle.currentTurn
    this.characters = battle.characters
    this.alreadyActedCharacters = battle.alreadyActedCharacters
    this.strongElement = battle.strongElement
    this.weakElement = battle.weakElement
  }

  static from(battle: Battle): BattleVM {
    return new BattleVM({
      id: battle.id,
      currentTurn: battle.currentTurn,
      characters: battle.characters.map(CharacterBattleVM.from),
      alreadyActedCharacters: battle.alreadyActedCharacters,
      strongElement: battle.strongElement,
      weakElement: battle.weakElement
    })
  }
}

export const BattleVMExample: BattleVM = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  currentTurn: 3,
  alreadyActedCharacters: ['fgh44hgf-9c0b-4ef8-bb6d-6bb9bd380ar7'],
  characters: [CharacterBattleVMExample],
  strongElement: MagicElement.FIRE,
  weakElement: MagicElement.WATER
}
