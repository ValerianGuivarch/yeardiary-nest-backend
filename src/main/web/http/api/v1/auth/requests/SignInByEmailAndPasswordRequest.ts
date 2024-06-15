import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class SignInByEmailAndPasswordRequest {
  @ApiProperty({ description: 'The email', type: String, format: 'email' })
  @IsString()
  @IsEmail()
  readonly email: string

  @ApiProperty({ description: 'The password', type: String })
  @IsString()
  readonly password: string
}
