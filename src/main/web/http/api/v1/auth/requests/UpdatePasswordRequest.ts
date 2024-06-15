import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class UpdatePasswordRequest {
  @ApiProperty({ description: 'The email', type: String, format: 'email' })
  @IsString()
  @IsEmail()
  readonly email: string

  @ApiProperty({ description: 'The password', type: String })
  @IsString()
  readonly password: string

  @ApiProperty({ description: 'The token', type: String })
  @IsString()
  readonly token: string
}

export const UpdatePasswordRequestExample: UpdatePasswordRequest = {
  email: '8pZi8@example.com',
  password: 'password',
  token: 'token'
}
