import { ClasseVM, ClasseVMExample } from '../../classes/entities/ClasseVM'
import { ApiProperty } from '@nestjs/swagger'

export class CharacterClasseVM {
  @ApiProperty({ description: 'The character classe level', type: Number })
  level: number

  @ApiProperty({ description: 'The classe', type: ClasseVM })
  classe: ClasseVM

  constructor(characterClasse: CharacterClasseVM) {
    this.level = characterClasse.level
    this.classe = characterClasse.classe
  }

  static from(characterClasse: CharacterClasseVM): CharacterClasseVM {
    return new CharacterClasseVM({
      level: characterClasse.level,
      classe: characterClasse.classe
    })
  }
}

export const CharacterClasseVMExample = {
  level: 4,
  classe: ClasseVMExample
}
