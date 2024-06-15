import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateGuildRequest {
  @ApiProperty({ description: 'The guild name', type: String })
  @IsString()
  name: string
}

export const CreateGuildRequestExample = {
  name: 'My Guild'
}
