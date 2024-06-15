import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class UpdateCharacterClassRequest {
  @ApiProperty({ description: 'The level of the class', type: Number, format: 'int32' })
  @IsInt()
  level: number
}

export const UpdateCharacterClassRequestExample = {
  level: 1
}
