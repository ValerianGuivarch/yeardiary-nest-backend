import { SKILL_MIN_LEVEL } from '../../../../../../../domain/models/skills/Skill'
import { SkillType } from '../../../../../../../domain/models/skills/SkillType'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsString, Min } from 'class-validator'

export class UpdateSkillRequest {
  @ApiProperty({ description: 'The skill name', type: 'string' })
  @IsString()
  name: string

  @ApiProperty({ description: 'The skill description', type: 'string' })
  @IsString()
  description: string

  @ApiProperty({ description: 'The skill damage', type: 'number' })
  @IsNumber()
  damage: number

  @ApiProperty({ description: 'The skill minimum level to learn', type: 'number', minimum: SKILL_MIN_LEVEL })
  @IsNumber()
  @Min(SKILL_MIN_LEVEL)
  minimumLevel: number

  @ApiProperty({
    description: 'The skill type',
    examples: Object.values(SkillType),
    enumName: 'SkillType',
    enum: SkillType
  })
  @IsEnum(SkillType)
  type: SkillType
}
