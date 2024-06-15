import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateAccountGoogleRequest {
  @ApiProperty({
    description: 'The username',
    type: String
  })
  @IsString()
  readonly username: string

  @ApiProperty({
    description: 'The email',
    type: String,
    format: 'email'
  })
  @IsString()
  readonly email: string

  @ApiProperty({
    description: 'The google id',
    type: String
  })
  @IsString()
  readonly googleId: string
}

export const CreateAccountGoogleRequestExample = {
  username: 'username',
  email: 'email@gmail.com',
  googleId: 'googleId'
}
