import { UpdateSkillRequest } from './UpdateSkillRequest'
import { SkillType } from '../../../../../../../domain/models/skills/SkillType'
import { WeaponType } from '../../../../../../../domain/models/skills/WeaponType'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class UpdateSkillPhysicalRequest extends UpdateSkillRequest {
  @ApiProperty({
    description: 'The physical skill weapon type',
    enumName: 'WeaponType',
    enum: WeaponType
  })
  @IsEnum(WeaponType)
  weaponType: WeaponType

  static isSkillPhysicalRequest(request: UpdateSkillRequest): request is UpdateSkillPhysicalRequest {
    return request.type === SkillType.PHYSICAL
  }
}

export const UpdateSkillPhysicalRequestExample = {
  name: 'Sword Slash',
  description: 'Slash an enemy in half',
  damage: 30,
  minimumLevel: 2,
  type: SkillType.PHYSICAL,
  weaponType: WeaponType.SWORD
}
