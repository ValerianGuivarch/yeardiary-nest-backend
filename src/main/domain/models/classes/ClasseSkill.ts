import { Classe } from './Classe'
import { Skill } from '../skills/Skill'

export class ClasseSkill {
  skill: Skill
  classe: Classe
  minimumClasseLevel: number

  constructor(classeSkill: ClasseSkill) {
    this.skill = classeSkill.skill
  }
}
export type ClasseSkillToCreate = Omit<ClasseSkill, 'skill'> & {
  skill: Pick<Skill, 'id'>
}
export type ClasseSkillToUpdate = Pick<ClasseSkill, 'minimumClasseLevel'>

export type ClasseSkillWithoutClasse = Omit<ClasseSkill, 'classe'>
