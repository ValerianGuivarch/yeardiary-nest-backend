import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateCharacterRequest {
  @ApiPropertyOptional({ description: 'The character name', type: String })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'The character level', type: Number, format: 'int32' })
  @IsOptional()
  @IsInt()
  level?: number
}

export const UpdateCharacterRequestExample = {
  name: 'Gandalf',
  level: 10
}
