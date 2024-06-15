import config from '../../../../config/configuration'
import { DomainErrors } from '../../../errors/DomainErrors'
import { comparePasswordPromise, hashPromise } from '../../../helpers/bcrypt/BcryptHelpers'
import { Account, AccountToCreate } from '../../../models/accounts/Account'
import { AccountState } from '../../../models/accounts/AccountState'
import { Authority } from '../../../models/accounts/Authority'
import { AuthenticationMethodName } from '../../../models/auth/AuthenticationMethodName'
import {
  AUTHENTICATION_PASSWORD_HASH,
  AuthenticationWithPassword
} from '../../../models/auth/AuthenticationWithPassword'
import { JWTToken } from '../../../models/auth/JWTToken'
import { AccountService } from '../../entities/account/AccountService'
import { GoogleAuthenticationService } from '../../entities/auth/GoogleAuthenticationService'
import { JWTTokenService } from '../../entities/jwt_token/JWTTokenService'
import { MailService } from '../../entities/mails/MailService'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AuthenticationWorkflowService {
  private readonly logger = new Logger(AuthenticationWorkflowService.name)
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenService: JWTTokenService,
    private readonly emailService: MailService,
    private readonly googleService: GoogleAuthenticationService
  ) {}

  async registerWithMailPassword(p: { accountToCreate: AccountToCreate; password: string }): Promise<Account> {
    this.logger.verbose(`registerWithMailPassword > Account > signup`)
    const hashedPassword = await hashPromise(p.password, AUTHENTICATION_PASSWORD_HASH)
    let account: Account
    if (config().email.enabled) {
      account = await this.accountService.createAccountWithAuthenticationWithPassword({
        account: p.accountToCreate,
        authentication: { hashedPassword: hashedPassword }
      })
      await this.emailService.sendInitAccountEmail({ accountId: account.id, email: account.email })
    } else {
      account = await this.accountService.createAccountWithAuthenticationWithPassword({
        account: { ...p.accountToCreate, creationState: AccountState.ACTIVE },
        authentication: { hashedPassword: hashedPassword }
      })
    }
    return account
  }

  async signInWithEmailAndPassword(p: { email: string; password: string }): Promise<JWTToken> {
    this.logger.verbose(`signInWithEmailAndPassword > Account[${p.email}] > signin`)
    const account = await this.accountService.findByEmail(p.email)
    if (!account) {
      throw DomainErrors.ConnexionFailedAccountNotFound(p.email)
    }
    if (account.creationState !== AccountState.ACTIVE) {
      throw DomainErrors.ConnexionFailedAccountNotActive(p.email)
    }
    let authenticationWithPassword: AuthenticationWithPassword
    try {
      authenticationWithPassword = await this.accountService.findAuthenticationWithPasswordByAccountId(account.id)
    } catch (e) {
      throw DomainErrors.ConnexionFailedAccountNotAuthenticationByEmail()
    }
    const checkPassword = await comparePasswordPromise(p.password, authenticationWithPassword.hashedPassword)
    if (!checkPassword) {
      throw DomainErrors.wrongCredentials()
    }

    return this.tokenService.generateTokens({
      accountId: account.id,
      secret: account.secret,
      authority: account.authority,
      authMethod: authenticationWithPassword
    })
  }

  async signInWithGoogle(p: { code: string }): Promise<JWTToken> {
    const googleCredentials = await this.googleService.getTokens(p.code)
    const googleUserInfo = await this.googleService.getUserInfo(googleCredentials)

    let account = await this.accountService.findByEmail(googleUserInfo.email)
    if (!account) {
      account = await this.accountService.registerWithGoogle({
        authority: Authority.USER,
        googleCredentials: googleCredentials,
        googleUserInfo: googleUserInfo
      })
    } else {
      // TODO update account eventually
    }
    const auth = await this.accountService.findAuthenticationWithGoogleByAccountId(account.id)
    return this.tokenService.generateTokens({
      accountId: account.id,
      secret: account.secret,
      authority: account.authority,
      authMethod: auth
    })
  }

  async refreshToken(refreshToken: string): Promise<JWTToken> {
    this.logger.verbose(`refreshToken > Token[${refreshToken}] > signin`)
    const auth = await this.tokenService.unpackToken(refreshToken)
    const account = await this.accountService.findOneById(auth.subject)
    if (account.creationState !== AccountState.ACTIVE) {
      throw DomainErrors.ConnexionFailedAccountNotActive(account.email)
    }
    await this.tokenService.verifyToken(refreshToken, account.secret)
    if (!auth.isRefreshToken) {
      throw DomainErrors.WrongToken()
    }
    switch (auth.authenticationMethod) {
      case AuthenticationMethodName.EMAIL_PASSWORD: {
        const passwordAuth = await this.accountService.findAuthenticationWithPasswordByAccountId(account.id)
        if (auth.issuedAt < passwordAuth.updatedDate) {
          throw DomainErrors.WrongToken()
        }
        return this.tokenService.generateTokens({
          accountId: account.id,
          secret: account.secret,
          authority: account.authority,
          authMethod: passwordAuth
        })
      }
      default:
        throw DomainErrors.WrongToken()
    }
  }

  async getConnectedAccount(accessToken: string): Promise<Account> {
    this.logger.verbose(`getConnectedAccount > Token[${accessToken}] > signin`)
    const auth = await this.tokenService.unpackToken(accessToken)
    if (auth.isRefreshToken) {
      throw DomainErrors.WrongToken()
    }
    const account = await this.accountService.findOneById(auth.subject)
    await this.tokenService.verifyToken(accessToken, account.secret)
    return account
  }

  async validateAccountEmailCreation(p: { email: string; token: string }): Promise<JWTToken> {
    this.logger.verbose(`validateAccountEmailCreation > Email[${p.email}] Token[${p.token}] > token`)
    const account = await this.accountService.findByEmail(p.email)
    if (!account) {
      throw DomainErrors.validateAccountEmailCreationFailed('account not found')
    }
    if (account.creationState !== AccountState.PENDING) {
      throw DomainErrors.validateAccountEmailCreationFailed('account already created')
    }
    if (await this.emailService.validateEmailToken(account.id, p.token)) {
      await this.emailService.deleteEmailTokenByAccountId(account.id)
      await this.accountService.updateAccountCreationState(account.id, AccountState.ACTIVE)
    } else {
      throw DomainErrors.validateAccountEmailCreationFailed('invalid token')
    }
    const authenticationWithPassword = await this.accountService.findAuthenticationWithPasswordByAccountId(account.id)
    return this.tokenService.generateTokens({
      accountId: account.id,
      secret: account.secret,
      authority: account.authority,
      authMethod: authenticationWithPassword
    })
  }

  async forgotPassword(email: string): Promise<Account> {
    this.logger.verbose(`initPassword > Account > initPassword`)
    const account = await this.accountService.findByEmail(email)
    if (!account) {
      throw DomainErrors.noAccountWithEmail(email)
    }
    if (config().email.enabled) {
      await this.emailService.sendForgotPasswordEmail({ accountId: account.id, email: account.email })
    }
    return account
  }

  async updatePassword(p: { email: string; token: string; newPassword: string }): Promise<JWTToken> {
    this.logger.verbose(`validateInitPassword > Email[${p.email}] Token[${p.token}] > token`)
    const account = await this.accountService.findByEmail(p.email)
    if (!account) {
      throw DomainErrors.validateInitPasswordFailed('account not found')
    }
    if (await this.emailService.validateEmailToken(account.id, p.token)) {
      const hashedPassword = await hashPromise(p.newPassword, AUTHENTICATION_PASSWORD_HASH)
      const authenticationWithPassword = await this.accountService.updateAuthenticationWithPasswordByAccountId(
        account.id,
        { hashedPassword: hashedPassword }
      )
      return this.tokenService.generateTokens({
        accountId: account.id,
        secret: account.secret,
        authority: account.authority,
        authMethod: authenticationWithPassword
      })
    } else {
      throw DomainErrors.validateAccountEmailCreationFailed('invalid token')
    }
  }
}
