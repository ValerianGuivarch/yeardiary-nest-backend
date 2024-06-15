import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateClasseRequest {
  @ApiProperty({ description: 'The classe name', type: String })
  @IsString()
  name: string
}

export const CreateClasseRequestExample = {
  name: 'Wizard'
}
