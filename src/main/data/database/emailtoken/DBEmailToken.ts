import { EmailToken } from '../../../domain/models/auth/EmailToken'
import { DBAccount } from '../accounts/DBAccount'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'EmailToken' })
export class DBEmailToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column()
  accountId: string
  @ManyToOne(() => DBAccount)
  @JoinColumn({ name: 'accountId' })
  account: DBAccount

  @Column()
  token: string

  @Column()
  expirationDate: Date

  static toEmailToken(doc: DBEmailToken): EmailToken {
    return new EmailToken({
      id: doc.id.toString(),
      accountId: doc.accountId,
      token: doc.token,
      expirationDate: doc.expirationDate,
      createdDate: doc.createdDate
    })
  }
}
