import { DBSkill } from './DBSkill'
import { MagicElement } from '../../../domain/models/skills/MagicElement'
import { Skill } from '../../../domain/models/skills/Skill'
import { SkillMagical } from '../../../domain/models/skills/SkillMagical'
import { SkillType } from '../../../domain/models/skills/SkillType'
import { Column, ChildEntity } from 'typeorm'

@ChildEntity()
export class DBSkillMagical extends DBSkill {
  @Column({ type: 'varchar', nullable: false })
  element: MagicElement

  @Column({ type: 'integer', nullable: false, default: 0 })
  spellLevel: number

  static toSkillMagical(dbSkill: DBSkillMagical): Skill {
    return new SkillMagical({
      damage: dbSkill.damage,
      description: dbSkill.description,
      element: dbSkill.element,
      minimumLevel: dbSkill.minimumLevel,
      name: dbSkill.name,
      spellLevel: dbSkill.spellLevel,
      id: dbSkill.id
    })
  }
  static isDBSkillMagical(dbSkill: DBSkill): dbSkill is DBSkillMagical {
    return dbSkill instanceof DBSkillMagical
  }
}

export type DBSkillMagicalToCreate = Omit<DBSkillMagical, 'id' | 'type'> & {
  type: SkillType.MAGICAL
}

export type DBSkillMagicalToUpdate = Omit<DBSkillMagical, 'id' | 'type' | 'createdDate'>
