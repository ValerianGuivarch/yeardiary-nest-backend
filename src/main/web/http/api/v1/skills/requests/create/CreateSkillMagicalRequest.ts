import { CreateSkillRequest } from './CreateSkillRequest'
import { MagicElement } from '../../../../../../../domain/models/skills/MagicElement'
import {
  SKILL_MAGICAL_SPELL_LEVEL_MAX,
  SKILL_MAGICAL_SPELL_LEVEL_MIN
} from '../../../../../../../domain/models/skills/SkillMagical'
import { SkillType } from '../../../../../../../domain/models/skills/SkillType'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, Max, Min } from 'class-validator'

export class CreateSkillMagicalRequest extends CreateSkillRequest {
  @ApiProperty({
    description: 'The skill spell level',
    type: 'number',
    format: 'int32',
    minimum: SKILL_MAGICAL_SPELL_LEVEL_MIN,
    maximum: SKILL_MAGICAL_SPELL_LEVEL_MAX
  })
  @IsInt()
  @Min(SKILL_MAGICAL_SPELL_LEVEL_MIN)
  @Max(SKILL_MAGICAL_SPELL_LEVEL_MAX)
  spellLevel: number

  @ApiProperty({
    description: 'The magical skill element',
    enumName: 'MagicElement',
    enum: MagicElement
  })
  @IsEnum(MagicElement)
  element: MagicElement
}

export const CreateSkillMagicalRequestExample = {
  name: 'fireball',
  description: 'Burn everything in a radius',
  damage: 50,
  minimumLevel: 4,
  type: SkillType.MAGICAL,
  spellLevel: 3,
  element: MagicElement.FIRE
}
