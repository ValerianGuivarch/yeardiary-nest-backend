import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateItemRequest {
  @ApiProperty({ description: 'The id of the character owner of the item', type: String, format: 'uuid' })
  @IsUUID()
  characterId: string

  @ApiProperty({ description: 'The name of the item', type: String })
  @IsString()
  name: string
}

export const CreateItemRequestExample = {
  characterId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Sword'
}
