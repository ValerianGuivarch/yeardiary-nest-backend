import { CharacterClasseVM, CharacterClasseVMExample } from './CharacterClasseVM'
import { Character } from '../../../../../../domain/models/characters/Character'
import { RaceVM, RaceVMExample } from '../../races/entities/RaceVM'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CharacterVM {
  @ApiProperty({
    description: 'The character uuid',
    type: String,
    format: 'uuid'
  })
  id: string

  @ApiProperty({
    description: 'The account owning this character',
    type: String,
    format: 'uuid'
  })
  accountId: string

  @ApiProperty({
    description: 'The character name',
    type: String
  })
  name: string

  @ApiProperty({
    description: 'The character level',
    type: Number
  })
  level: number

  @ApiProperty({
    description: 'The character current level',
    type: Number
  })
  currentLevel: number

  @ApiProperty({
    description: 'All character classes',
    isArray: true,
    type: CharacterClasseVM
  })
  classes: CharacterClasseVM[]

  @ApiPropertyOptional({
    description: 'The character invoker id',
    type: String
  })
  invokerId?: string

  @ApiPropertyOptional({
    description: 'The character picture',
    type: String
  })
  picture?: string

  @ApiProperty({
    description: 'The character race',
    type: RaceVM
  })
  race: RaceVM

  constructor(character: CharacterVM) {
    this.id = character.id
    this.accountId = character.accountId
    this.name = character.name
    this.level = character.level
    this.currentLevel = character.currentLevel
    this.classes = character.classes
    this.invokerId = character.invokerId
    this.picture = character.picture
    this.race = character.race
  }
  static from(character: Character): CharacterVM {
    return new CharacterVM({
      id: character.id,
      accountId: character.linkedAccount.id,
      name: character.name,
      level: character.level,
      currentLevel: character.currentLevel,
      race: RaceVM.from(character.race),
      invokerId: character.linkedInvoker?.id ?? undefined,
      classes: character.classes.map(CharacterClasseVM.from)
    })
  }
}

export const CharacterVMExample: CharacterVM = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  accountId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  name: 'Gandalf',
  level: 10,
  currentLevel: 10,
  race: RaceVMExample,
  invokerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  classes: [CharacterClasseVMExample],
  picture: 'https://example.com/picture.png'
}
