import { DBClasse } from '../../../main/data/database/classes/DBClasse'
import { DBClasseSkill } from '../../../main/data/database/classes_skills/DBClasseSkill'
import { DBSkill } from '../../../main/data/database/skills/DBSkill'
import { Chance } from 'chance'

export class TestClasseSkillHelpers {
  static chance = new Chance()

  static generateDBClasseSkill(linkedEntities: { skill: DBSkill; classe: DBClasse }): DBClasseSkill {
    return {
      minimumClasseLevel: this.chance.integer({ min: 1, max: 20 }),
      skill: linkedEntities.skill,
      skillId: linkedEntities.skill.id,
      createdDate: this.chance.date(),
      classe: linkedEntities.classe,
      classeId: linkedEntities.classe.id,
      updatedDate: this.chance.date()
    }
  }
}
