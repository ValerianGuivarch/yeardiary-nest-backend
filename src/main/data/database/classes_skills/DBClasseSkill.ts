import { ClasseSkillWithoutClasse } from '../../../domain/models/classes/ClasseSkill'
import { DBClasse } from '../classes/DBClasse'
import { DBSkill } from '../skills/DBSkill'
import { DBSkillProvider } from '../skills/DBSkillProvider'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('ClasseSkill')
export class DBClasseSkill {
  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ type: 'integer', nullable: false, default: 0 })
  minimumClasseLevel: number

  @PrimaryColumn({ type: 'uuid', nullable: false })
  classeId: string

  @ManyToOne(() => DBClasse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classeId' })
  classe: DBClasse

  @PrimaryColumn({ type: 'uuid' })
  skillId: string

  @ManyToOne(() => DBSkill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill: DBSkill

  static RELATION = {}

  static toClasseSkillWithoutClasse(dbClasseSkill: DBClasseSkill): ClasseSkillWithoutClasse {
    return {
      skill: DBSkillProvider.toSkill(dbClasseSkill.skill),
      minimumClasseLevel: dbClasseSkill.minimumClasseLevel
    }
  }
}
