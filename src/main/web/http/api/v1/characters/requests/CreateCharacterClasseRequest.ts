import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsUUID } from 'class-validator'

export class CreateCharacterClassRequest {
  @ApiProperty({ description: 'The class ID', type: String, format: 'uuid' })
  @IsUUID()
  classeId: string

  @ApiProperty({ description: 'The level of the class', type: Number, format: 'int32' })
  @IsInt()
  level: number
}

export const CreateCharacterClassRequestExample = {
  level: 1,
  classeId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'
}
