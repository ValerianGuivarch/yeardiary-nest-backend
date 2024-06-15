import { Classe } from '../../../domain/models/classes/Classe'
import { DBClasseSkill } from '../classes_skills/DBClasseSkill'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

@Entity('Classe')
export class DBClasse {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ type: 'varchar', nullable: false })
  name: string

  @OneToMany(() => DBClasseSkill, (classeSkill) => classeSkill.classe)
  skills: DBClasseSkill[]

  static readonly RELATIONS = {
    skills: { skill: true }
  }

  static toClasse(classe: DBClasse): Classe {
    return new Classe({
      id: classe.id,
      name: classe.name,
      skills: classe.skills.map(DBClasseSkill.toClasseSkillWithoutClasse)
    })
  }
}

export type DBClasseToCreate = Omit<DBClasse, 'id' | 'skills'>
export type DBClasseToUpdate = Omit<DBClasse, 'id' | 'createdDate' | 'skills'>
