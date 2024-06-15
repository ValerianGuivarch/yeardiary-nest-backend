import { DBAccount } from './DBAccount'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, TableInheritance } from 'typeorm'

@Entity('AuthenticationMethod')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class DBAuthenticationMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date

  @Column({ type: 'uuid', nullable: false })
  accountId: string

  @ManyToOne(() => DBAccount, { onDelete: 'CASCADE' }) // TODO check this
  @JoinColumn({ name: 'accountId' })
  account?: DBAccount

  @Column({ type: 'varchar', name: 'type' })
  type: string
}
