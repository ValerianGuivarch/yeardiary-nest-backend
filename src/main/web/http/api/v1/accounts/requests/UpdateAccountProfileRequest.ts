import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateAccountProfileRequest {
  @ApiPropertyOptional({
    description: 'The first name',
    type: String
  })
  @IsOptional()
  @IsString()
  readonly firstName?: string

  @ApiPropertyOptional({
    description: 'The last name',
    type: String
  })
  @IsOptional()
  @IsString()
  readonly lastName?: string
}
