import { Skill } from './Skill'
import { SkillType } from './SkillType'
import { WeaponType } from './WeaponType'

export class SkillPhysical extends Skill {
  weaponType: WeaponType
  readonly type = SkillType.PHYSICAL

  constructor(p: {
    id: string
    name: string
    description: string
    minimumLevel: number
    damage: number
    weaponType: WeaponType
  }) {
    super({
      id: p.id,
      name: p.name,
      description: p.description,
      minimumLevel: p.minimumLevel,
      damage: p.damage
    })
    this.weaponType = p.weaponType
  }

  static toSkillPhysicalToCreate(p: {
    name: string
    description: string
    minimumLevel: number
    damage: number
    weaponType: WeaponType
  }): SkillPhysicalToCreate {
    return p
  }

  static isSkillPhysical(skill: Skill): skill is SkillPhysical {
    return skill.type === SkillType.PHYSICAL
  }
}
export type SkillPhysicalToCreate = Omit<SkillPhysical, 'id' | 'type'>
export type SkillPhysicalToUpdate = Pick<
  SkillPhysical,
  'name' | 'description' | 'minimumLevel' | 'damage' | 'weaponType'
>
