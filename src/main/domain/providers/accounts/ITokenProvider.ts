import { Authority } from '../../models/accounts/Authority'
import { Authentication } from '../../models/auth/Authentication'
import { JWTToken } from '../../models/auth/JWTToken'

export interface ITokenProvider {
  generateTokens(p: { accountId: string; authority: Authority; secret: string }): Promise<JWTToken>
  unpackToken(accessToken: string): Promise<Authentication>
  verifyToken(accessToken: string, secret: string): Promise<void>
}
