import { CreateSkillRequest } from './CreateSkillRequest'
import { SkillType } from '../../../../../../../domain/models/skills/SkillType'
import { WeaponType } from '../../../../../../../domain/models/skills/WeaponType'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class CreateSkillPhysicalRequest extends CreateSkillRequest {
  @ApiProperty({
    description: 'The physical skill weapon type',
    enumName: 'WeaponType',
    enum: WeaponType
  })
  @IsEnum(WeaponType)
  weaponType: WeaponType
}

export const CreateSkillPhysicalRequestExample = {
  name: 'Sword Slash',
  description: 'Slash an enemy in half',
  damage: 30,
  minimumLevel: 2,
  type: SkillType.PHYSICAL,
  weaponType: WeaponType.SWORD
}
