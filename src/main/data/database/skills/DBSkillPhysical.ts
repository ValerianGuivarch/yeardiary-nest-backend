import { DBSkill } from './DBSkill'
import { Skill } from '../../../domain/models/skills/Skill'
import { SkillPhysical } from '../../../domain/models/skills/SkillPhysical'
import { SkillType } from '../../../domain/models/skills/SkillType'
import { WeaponType } from '../../../domain/models/skills/WeaponType'
import { Column, ChildEntity } from 'typeorm'

@ChildEntity()
export class DBSkillPhysical extends DBSkill {
  @Column({ type: 'varchar', nullable: true })
  weaponType: WeaponType

  static toSkillPhysical(dbSkill: DBSkillPhysical): Skill {
    return new SkillPhysical({
      damage: dbSkill.damage,
      description: dbSkill.description,
      id: dbSkill.id,
      minimumLevel: dbSkill.minimumLevel,
      name: dbSkill.name,
      weaponType: dbSkill.weaponType
    })
  }
  static isDBSkillPhysical(dbSkill: DBSkill): dbSkill is DBSkillPhysical {
    return dbSkill instanceof DBSkillPhysical
  }
}

export type DBSkillPhysicalToCreate = Omit<DBSkillPhysical, 'id' | 'type'> & {
  type: SkillType.PHYSICAL
}

export type DBSkillPhysicalToUpdate = Omit<DBSkillPhysical, 'id' | 'type' | 'createdDate'>
