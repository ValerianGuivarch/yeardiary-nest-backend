import { ClasseSkillWithoutClasse } from './ClasseSkill'

export class Classe {
  id: string
  name: string
  skills: ClasseSkillWithoutClasse[]

  constructor(classe: Classe) {
    this.id = classe.id
    this.name = classe.name
    this.skills = classe.skills
  }

  static toClasseToCreate(p: { name: string }): ClasseToCreate {
    return {
      name: p.name
    }
  }
}

export type ClasseToCreate = Omit<Classe, 'id' | 'skills'>
export type ClasseToUpdate = Pick<Classe, 'name'>
