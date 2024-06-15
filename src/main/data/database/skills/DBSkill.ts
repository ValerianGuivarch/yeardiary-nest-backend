import { Entity, PrimaryGeneratedColumn, Column, TableInheritance } from 'typeorm'

@Entity('Skill')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DBSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false })
  description: string

  @Column({ type: 'integer', nullable: false, default: 0 })
  damage: number

  @Column({ type: 'integer', nullable: false, default: 0 })
  minimumLevel: number

  static readonly RELATIONS = []
}
