import { CharacterBattle } from '../../../../../../domain/models/battles/CharacterBattle'
import { CharacterVM, CharacterVMExample } from '../../characters/entities/CharacterVM'
import { ApiProperty } from '@nestjs/swagger'

export class CharacterBattleVM {
  @ApiProperty({ description: 'The character', type: CharacterVM })
  character: CharacterVM

  constructor(characterBattle: CharacterBattleVM) {
    this.character = characterBattle.character
  }

  static from(characterBattle: CharacterBattle): CharacterBattleVM {
    return new CharacterBattleVM({
      character: CharacterVM.from(characterBattle.character)
    })
  }
}

export const CharacterBattleVMExample = {
  character: CharacterVMExample
}
