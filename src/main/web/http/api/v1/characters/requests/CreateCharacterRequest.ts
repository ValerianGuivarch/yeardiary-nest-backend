import { CreateCharacterClassRequest, CreateCharacterClassRequestExample } from './CreateCharacterClasseRequest'
import { CHARACTER_NAME_MIN_LENGTH } from '../../../../../../domain/models/characters/Character'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator'

export class CreateCharacterRequest {
  @ApiProperty({
    description: 'The character name',
    type: String,
    minLength: CHARACTER_NAME_MIN_LENGTH
  })
  @IsString()
  @MinLength(CHARACTER_NAME_MIN_LENGTH)
  name: string

  @ApiProperty({ description: 'The character level', type: Number, format: 'int32' })
  @IsInt()
  level: number

  @ApiPropertyOptional({ description: 'The character invoker id', type: String })
  @IsOptional()
  @IsUUID()
  invokerId?: string

  @ApiProperty({ description: 'The character race', type: String })
  @IsUUID()
  raceId: string

  @ApiProperty({
    description: 'The character classes',
    type: CreateCharacterClassRequest,
    isArray: true
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCharacterClassRequest)
  classes: CreateCharacterClassRequest[]
}

export const CreateCharacterRequestExample = {
  name: 'Gandalf',
  level: 10,
  invokerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  raceId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  classes: [CreateCharacterClassRequestExample]
}
