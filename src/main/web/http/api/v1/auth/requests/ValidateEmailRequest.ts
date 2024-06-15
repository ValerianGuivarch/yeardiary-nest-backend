import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class ValidateEmailRequest {
  @ApiProperty({ description: 'The account email' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'The token' })
  @IsString()
  token: string
}

export const ValidateEmailRequestExample: ValidateEmailRequest = {
  email: '8pZi8@example.com',
  token: 'token'
}
