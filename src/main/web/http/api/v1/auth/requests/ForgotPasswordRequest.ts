import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class ForgotPasswordRequest {
  @ApiProperty({ description: 'The email', type: String, format: 'email' })
  @IsString()
  @IsEmail()
  readonly email: string
}

export const ForgotPasswordRequestExample: ForgotPasswordRequest = {
  email: '8pZi8@example.com'
}
