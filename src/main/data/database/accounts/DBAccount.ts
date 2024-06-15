import { AccountState } from '../../../domain/models/accounts/AccountState'
import { Authority } from '../../../domain/models/accounts/Authority'
import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'Account' })
export class DBAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ type: 'varchar', default: Authority.USER })
  authority: Authority

  @Column({ type: 'varchar' })
  secret: string

  @Column({ type: 'varchar' })
  creationState: AccountState

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true, nullable: true })
  phoneNumber?: string

  @Column({ type: 'varchar' })
  username: string

  @Column({ type: 'varchar' })
  firstname: string

  @Column({ type: 'varchar' })
  lastname: string
}

export type DBAccountToCreate = Omit<DBAccount, 'id'>

export type DBAccountToUpdate = Omit<DBAccount, 'id' | 'createdDate'>
