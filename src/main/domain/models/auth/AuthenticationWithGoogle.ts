import { AuthenticationMethod } from './AuthenticationMethod'

export class AuthenticationWithGoogle extends AuthenticationMethod {
  googleId: string
  hashedRefreshToken: string

  constructor(p: AuthenticationWithGoogle) {
    super(p)
    this.googleId = p.googleId
    this.hashedRefreshToken = p.hashedRefreshToken
  }

  static toAuthenticationWithGoogleToCreate(p: AuthenticationWithGoogle): AuthenticationWithGoogleToCreate {
    return {
      googleId: p.googleId,
      hashedRefreshToken: p.hashedRefreshToken
    }
  }
}

export type AuthenticationWithGoogleToCreate = Omit<AuthenticationWithGoogle, 'id' | 'accountId'>
