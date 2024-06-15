import { SKILL_MIN_LEVEL } from '../../../../../../domain/models/skills/Skill'
import { SkillType } from '../../../../../../domain/models/skills/SkillType'
import { ApiProperty } from '@nestjs/swagger'

export abstract class SkillVM {
  @ApiProperty({ description: 'The skill uid', type: 'string' })
  id: string

  @ApiProperty({ description: 'The skill name', type: 'string' })
  name: string

  @ApiProperty({ description: 'The skill description', type: 'string' })
  description: string

  @ApiProperty({ description: 'The skill damage', type: 'number' })
  damage: number

  @ApiProperty({ description: 'The skill minimum level to learn', type: 'number', minimum: SKILL_MIN_LEVEL })
  minimumLevel: number

  @ApiProperty({
    description: 'The skill type',
    enumName: 'SkillType',
    enum: SkillType
  })
  type: SkillType

  protected constructor(skill: SkillVM) {
    this.id = skill.id
    this.name = skill.name
    this.description = skill.description
    this.damage = skill.damage
    this.minimumLevel = skill.minimumLevel
    this.type = skill.type
  }
}
