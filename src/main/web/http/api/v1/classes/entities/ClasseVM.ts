import { Classe } from '../../../../../../domain/models/classes/Classe'
import { ApiProperty } from '@nestjs/swagger'

export class ClasseVM {
  @ApiProperty({
    description: 'The classe uuid',
    type: String,
    format: 'uuid'
  })
  id: string

  @ApiProperty({
    description: 'The classe name',
    type: String
  })
  name: string

  constructor(classe: ClasseVM) {
    this.id = classe.id
    this.name = classe.name
  }

  static from(classe: Classe): ClasseVM {
    return new ClasseVM({
      id: classe.id,
      name: classe.name
    })
  }
}

export const ClasseVMExample = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Wizard'
}
