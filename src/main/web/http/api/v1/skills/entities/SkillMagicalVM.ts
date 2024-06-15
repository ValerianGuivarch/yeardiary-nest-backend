import { SkillVM } from './SkillVM'
import { MagicElement } from '../../../../../../domain/models/skills/MagicElement'
import {
  SKILL_MAGICAL_SPELL_LEVEL_MAX,
  SKILL_MAGICAL_SPELL_LEVEL_MIN,
  SkillMagical
} from '../../../../../../domain/models/skills/SkillMagical'
import { SkillType } from '../../../../../../domain/models/skills/SkillType'
import { ApiProperty } from '@nestjs/swagger'

export class SkillMagicalVM extends SkillVM {
  @ApiProperty({
    description: 'The skill spell level',
    type: 'number',
    minimum: SKILL_MAGICAL_SPELL_LEVEL_MIN,
    maximum: SKILL_MAGICAL_SPELL_LEVEL_MAX
  })
  spellLevel: number

  @ApiProperty({
    description: 'The magical skill element',
    enumName: 'MagicElement',
    enum: MagicElement
  })
  element: MagicElement

  constructor(skill: SkillMagicalVM) {
    super(skill)
    this.spellLevel = skill.spellLevel
    this.element = skill.element
  }

  static from(skill: SkillMagical): SkillMagicalVM {
    return new SkillMagicalVM({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      damage: skill.damage,
      minimumLevel: skill.minimumLevel,
      type: skill.type,
      spellLevel: skill.spellLevel,
      element: skill.element
    })
  }
}

export const SkillMagicalVMExample: SkillMagicalVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  name: 'Fireball',
  description: 'Burn everything in a radius',
  damage: 50,
  minimumLevel: 3,
  type: SkillType.MAGICAL,
  spellLevel: 1,
  element: MagicElement.FIRE
}
