import { MagicElement } from '../../../../../../domain/models/skills/MagicElement'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class UpdateBattleRequest {
  @ApiProperty({
    description: 'The battle strong magic element',
    enum: MagicElement,
    enumName: 'MagicElement'
  })
  @IsEnum(MagicElement)
  strongElement: MagicElement

  @ApiProperty({
    description: 'The battle weak magic element',
    enum: MagicElement,
    enumName: 'MagicElement'
  })
  @IsEnum(MagicElement)
  weakElement: MagicElement
}

export const UpdateBattleRequestExample: UpdateBattleRequest = {
  strongElement: MagicElement.FIRE,
  weakElement: MagicElement.WATER
}
