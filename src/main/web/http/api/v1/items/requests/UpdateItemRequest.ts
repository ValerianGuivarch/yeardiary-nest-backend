import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class UpdateItemRequest {
  @ApiProperty({ description: 'The used state of the item' })
  @IsBoolean()
  used: boolean
}

export const UpdateItemRequestExample = {
  used: true
}
