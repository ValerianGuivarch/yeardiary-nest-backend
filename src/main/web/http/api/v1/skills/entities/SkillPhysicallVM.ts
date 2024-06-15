import { SkillVM } from './SkillVM'
import { SkillPhysical } from '../../../../../../domain/models/skills/SkillPhysical'
import { SkillType } from '../../../../../../domain/models/skills/SkillType'
import { WeaponType } from '../../../../../../domain/models/skills/WeaponType'
import { ApiProperty } from '@nestjs/swagger'

export class SkillPhysicalVM extends SkillVM {
  @ApiProperty({
    description: 'The skill weapon type',
    enumName: 'WeaponType',
    enum: WeaponType
  })
  weaponType: WeaponType

  constructor(skill: SkillPhysicalVM) {
    super(skill)
    this.weaponType = skill.weaponType
  }

  static from(skill: SkillPhysical): SkillPhysicalVM {
    return new SkillPhysicalVM({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      damage: skill.damage,
      minimumLevel: skill.minimumLevel,
      type: skill.type,
      weaponType: skill.weaponType
    })
  }
}

export const SkillPhysicalVMExample: SkillPhysicalVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  name: 'Dagger attack',
  description: 'Cut a specific target',
  damage: 50,
  minimumLevel: 3,
  type: SkillType.PHYSICAL,
  weaponType: WeaponType.DAGGER
}
