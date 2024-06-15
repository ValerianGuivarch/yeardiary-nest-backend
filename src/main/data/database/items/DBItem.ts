import { Item } from '../../../domain/models/items/Item'
import { DBCharacter } from '../characters/DBCharacter'
import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

@Entity({ name: 'Item' })
export class DBItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  characterId: string

  @ManyToOne(() => DBCharacter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'characterId' })
  character: DBCharacter

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ nullable: false })
  name: string

  @Column({ default: true })
  used: boolean

  static readonly RELATIONS = {}

  static toItem(dbItem: DBItem): Item {
    return new Item({
      id: dbItem.id,
      name: dbItem.name,
      used: dbItem.used
    })
  }
}

export type DBItemToCreate = Omit<DBItem, 'id' | 'character'>
export type DBItemToUpdate = Pick<DBItem, 'used' | 'updatedDate'>
