import { Race } from '../../../domain/models/races/Race'
import { Size } from '../../../domain/models/races/Size'
import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'Race' })
export class DBRace {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ nullable: false })
  name: string

  @Column({ default: true })
  sleep: boolean

  @Column()
  size: Size

  static readonly RELATIONS = {}

  static toRace(dbRace: DBRace): Race {
    return new Race({
      id: dbRace.id,
      name: dbRace.name,
      size: dbRace.size,
      sleep: dbRace.sleep
    })
  }
}

export type DBRaceToCreate = Omit<DBRace, 'id'>
export type DBRaceToUpdate = Omit<DBRace, 'id' | 'createdDate'>

export const RELATIONS_RACE = {}
