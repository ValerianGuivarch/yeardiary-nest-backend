import { AuthenticationMethod } from './AuthenticationMethod'
export const AUTHENTICATION_PASSWORD_HASH = 10

export class AuthenticationWithPassword extends AuthenticationMethod {
  constructor(p: AuthenticationWithPassword) {
    super(p)
    this.hashedPassword = p.hashedPassword
  }
  hashedPassword: string
  updatedDate: Date
}
export type AuthenticationWithPasswordToCreate = Omit<AuthenticationWithPassword, 'id' | 'accountId' | 'updatedDate'>

export type AuthenticationWithPasswordToUpdate = Omit<AuthenticationWithPassword, 'id' | 'accountId'>
