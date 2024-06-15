import { GoogleUserInfo } from '../../../../data/google/GoogleUserInfo'
import { DomainErrors } from '../../../errors/DomainErrors'
import { hashPromise } from '../../../helpers/bcrypt/BcryptHelpers'
import { mergeNonNull } from '../../../helpers/EntityUtils'
import { Account, AccountToCreate, Profile } from '../../../models/accounts/Account'
import { AccountState } from '../../../models/accounts/AccountState'
import { Authority } from '../../../models/accounts/Authority'
import { AuthenticationWithGoogle } from '../../../models/auth/AuthenticationWithGoogle'
import {
  AUTHENTICATION_PASSWORD_HASH,
  AuthenticationWithPassword,
  AuthenticationWithPasswordToCreate,
  AuthenticationWithPasswordToUpdate
} from '../../../models/auth/AuthenticationWithPassword'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { IAccountProvider } from '../../../providers/accounts/IAccountProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Credentials } from 'google-auth-library'

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name)
  constructor(
    @Inject('IAccountProvider')
    private accountProvider: IAccountProvider
  ) {}

  async createAccountWithAuthenticationWithPassword(p: {
    account: AccountToCreate
    authentication: AuthenticationWithPasswordToCreate
  }): Promise<Account> {
    this.logger.verbose(`createAccount > Account[${p.account.email}] > update profile`)
    return await this.accountProvider.createWithMailPassword(p.authentication, p.account)
  }

  async updateAccountProfile(p: { account: Account; profile: Partial<Profile> }): Promise<Account> {
    this.logger.verbose(`updateAccountProfile > Account[${p.account.id}] > update profile`)
    return this.accountProvider.update({
      accountId: p.account.id,
      account: mergeNonNull<Account>(p.account, {
        profile: mergeNonNull<Profile>(p.account.profile, p.profile)
      })
    })
  }

  async updateAccountAuthority(accountId: string, authority: Authority): Promise<Account> {
    this.logger.verbose(`updateAccountAuthority > Account[${accountId}] > update authority`)
    return await this.accountProvider.update({
      accountId: accountId,
      account: { authority: authority }
    })
  }

  async updateAccountEmail(accountId: string, email: string): Promise<Account> {
    this.logger.verbose(`updateAccountEmail > Account[${accountId}] > update email`)
    return await this.accountProvider.update({
      accountId: accountId,
      account: { email: email }
    })
  }

  async findOneById(accountId: string): Promise<Account> {
    this.logger.verbose(`findOneById > Account[${accountId}] > find account`)
    return this.accountProvider.findOneById(accountId)
  }

  async findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Account>> {
    this.logger.verbose(`findAllPaginated > Accounts > find all accounts paginated`)
    return await this.accountProvider.findAllPaginated({ pageOptions: p.pageOptions })
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    this.logger.verbose(`findOneByEmail > Account[${email}] > find account`)
    return await this.accountProvider.findByEmail(email)
  }

  async findAuthenticationWithPasswordByAccountId(accountId: string): Promise<AuthenticationWithPassword> {
    this.logger.verbose(`findAuthenticationWithPasswordByAccountId > Account[${accountId}] > find authentication`)
    return await this.accountProvider.findAuthenticationWithPasswordByAccountId(accountId)
  }

  async updateAccountCreationState(accountId: string, creationState: AccountState): Promise<Account> {
    this.logger.verbose(`updateAccountState > Account[${accountId}] > update account state`)
    return await this.accountProvider.update({
      accountId: accountId,
      account: { creationState: creationState }
    })
  }

  async updateAuthenticationWithPasswordByAccountId(
    accountId: string,
    authenticationWithPassword: Partial<AuthenticationWithPasswordToUpdate>
  ): Promise<AuthenticationWithPassword> {
    return await this.accountProvider.updateAuthenticationWithPassword(accountId, authenticationWithPassword)
  }

  async registerWithGoogle(p: {
    googleCredentials: Credentials
    authority: Authority
    googleUserInfo: GoogleUserInfo
  }): Promise<Account> {
    if (!p.googleCredentials.refresh_token) {
      throw DomainErrors.GoogleRefreshTokenNotFound()
    }
    return await this.accountProvider.createWithGoogle(
      {
        googleId: p.googleUserInfo.id,
        hashedRefreshToken: await hashPromise(p.googleCredentials.refresh_token, AUTHENTICATION_PASSWORD_HASH)
      },
      Account.toAccountToCreate({
        username: p.googleUserInfo.given_name,
        email: p.googleUserInfo.email,
        authority: p.authority || Authority.USER,
        phoneNumber: undefined
      })
    )
  }

  async findAuthenticationWithGoogleByAccountId(accountId: string): Promise<AuthenticationWithGoogle> {
    this.logger.verbose('findAuthenticationWithGoogleByAccountId > Account[${accountId}] > find authentication')
    return await this.accountProvider.findAuthenticationWithGoogleByAccountId(accountId)
  }
}
