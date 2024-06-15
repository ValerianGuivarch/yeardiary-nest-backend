import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateGuildRequest {
  @ApiPropertyOptional({ description: 'The character name', type: String })
  @IsOptional()
  @IsString()
  name?: string
}

export const UpdateGuildRequestExample = {
  name: 'My Guild'
}
