import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateClasseRequest {
  @ApiProperty({ description: 'The classe name', type: String })
  @IsString()
  name: string
}

export const UpdateClasseRequestExample = {
  name: 'Warlock'
}
