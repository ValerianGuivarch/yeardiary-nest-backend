import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class CreateAccountMailPasswordRequest {
  @ApiProperty({ description: 'The username', type: String })
  @IsString()
  readonly username: string

  @ApiProperty({ description: 'The email', type: String, format: 'email' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ description: 'The password', type: String })
  @IsString()
  readonly password: string

  @ApiPropertyOptional({ description: 'The phone number', type: String, format: 'phone' })
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber?: string
}

export const CreateAccountMailPasswordRequestExample = {
  username: 'username',
  email: 'email@gmail.com',
  password: 'password',
  phoneNumber: '+33606060606'
}
