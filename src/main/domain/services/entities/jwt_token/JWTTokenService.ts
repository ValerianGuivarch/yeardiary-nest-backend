import config from '../../../../config/configuration'
import { DomainErrors } from '../../../errors/DomainErrors'
import { Authority } from '../../../models/accounts/Authority'
import { Authentication } from '../../../models/auth/Authentication'
import { AuthenticationMethod } from '../../../models/auth/AuthenticationMethod'
import { JWTToken } from '../../../models/auth/JWTToken'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class JWTTokenService {
  private readonly jwtSecret: string

  constructor(private jwtService: JwtService) {
    this.jwtSecret = config().JwtService.jwtSecret
  }

  async generateTokens(p: {
    accountId: string
    authority: Authority
    secret: string
    authMethod: AuthenticationMethod
  }): Promise<JWTToken> {
    const expirationAccess = config().JwtService.jwtExpiration
    const expirationRefresh = config().JwtService.jwtRefreshExpiration
    const accessToken = this.jwtService.sign(
      { authority: p.authority, isRefreshToken: false, auth_method: p.authMethod },
      {
        privateKey: this.jwtSecret + p.secret,
        expiresIn: expirationAccess,
        subject: p.accountId.toString()
      }
    )
    const refreshToken = this.jwtService.sign(
      { authority: p.authority, isRefreshToken: true, auth_method: p.authMethod },
      {
        privateKey: this.jwtSecret + p.secret,
        expiresIn: expirationRefresh,
        subject: p.accountId.toString()
      }
    )
    const today = new Date()
    return new JWTToken({
      accessToken: accessToken,
      accessTokenExpirationDate: new Date(
        // eslint-disable-next-line no-magic-numbers
        today.getTime() + 1_000 * expirationAccess
      ),
      refreshToken: refreshToken,
      refreshTokenExpirationDate: new Date(
        // eslint-disable-next-line no-magic-numbers
        today.getTime() + 1_000 * expirationRefresh
      )
    })
  }

  async unpackToken(token: string): Promise<Authentication> {
    const token2 = this.jwtService.decode(token)
    if (!token2) {
      throw DomainErrors.WrongToken()
    }
    if (typeof token2 === 'object') {
      return new Authentication({
        issuedAt: new Date(token2.iat ?? 0),
        expiresAt: new Date(token2.exp ?? 0),
        subject: token2.sub ?? '',
        isRefreshToken: token2.isRefreshToken,
        authenticationMethod: token2.auth_method
      })
    }
    throw DomainErrors.WrongToken()
  }

  async verifyToken(token: string, secret: string): Promise<void> {
    try {
      await this.jwtService.verify(token, {
        secret: this.jwtSecret + secret
      })
      return
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw DomainErrors.ExpiredToken()
      }
    }
    throw DomainErrors.WrongToken()
  }
}
