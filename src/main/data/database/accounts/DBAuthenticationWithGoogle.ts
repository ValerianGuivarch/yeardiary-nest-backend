import { DBAuthenticationMethod } from './DBAuthenticationMethod'
import { AuthenticationMethodName } from '../../../domain/models/auth/AuthenticationMethodName'
import { Entity, Column } from 'typeorm'

@Entity('AuthenticationMethod')
export class DBAuthenticationWithGoogle extends DBAuthenticationMethod {
  @Column()
  googleId: string

  @Column()
  hashedRefreshToken: string
}

export type DBAuthenticationWithGoogleToCreate = Omit<DBAuthenticationWithGoogle, 'id' | 'account' | 'type'> & {
  type: AuthenticationMethodName.GOOGLE
}
