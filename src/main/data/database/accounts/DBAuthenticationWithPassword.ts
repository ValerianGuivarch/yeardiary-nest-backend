import { DBAuthenticationMethod } from './DBAuthenticationMethod'
import { AuthenticationMethodName } from '../../../domain/models/auth/AuthenticationMethodName'
import { Entity, Column } from 'typeorm'

@Entity('AuthenticationMethod')
export class DBAuthenticationWithPassword extends DBAuthenticationMethod {
  @Column()
  hashedPassword: string
}

export type DBAuthenticationWithPasswordToCreate = Omit<DBAuthenticationWithPassword, 'id' | 'account' | 'type'> & {
  type: AuthenticationMethodName.EMAIL_PASSWORD
}
