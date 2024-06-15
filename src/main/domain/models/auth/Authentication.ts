import { AuthenticationMethodName } from './AuthenticationMethodName'

export class Authentication {
  issuedAt: Date
  expiresAt: Date
  subject: string
  isRefreshToken = false
  authenticationMethod: AuthenticationMethodName

  constructor(p: Authentication) {
    this.issuedAt = p.issuedAt
    this.expiresAt = p.expiresAt
    this.subject = p.subject
    this.isRefreshToken = p.isRefreshToken
    this.authenticationMethod = p.authenticationMethod
  }
}
