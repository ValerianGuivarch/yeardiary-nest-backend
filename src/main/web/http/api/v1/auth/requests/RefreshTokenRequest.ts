import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshTokenRequest {
  @ApiProperty({
    description: 'The refresh token',
    type: String
  })
  @IsString()
  readonly refreshToken: string
}
