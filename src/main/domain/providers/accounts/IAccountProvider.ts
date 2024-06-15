import { Account, AccountToCreate } from '../../models/accounts/Account'
import { AuthenticationWithGoogle, AuthenticationWithGoogleToCreate } from '../../models/auth/AuthenticationWithGoogle'
import {
  AuthenticationWithPassword,
  AuthenticationWithPasswordToCreate,
  AuthenticationWithPasswordToUpdate
} from '../../models/auth/AuthenticationWithPassword'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface IAccountProvider {
  createWithMailPassword(
    authenticationWithPasswordToCreate: AuthenticationWithPasswordToCreate,
    accountToCreate: AccountToCreate
  ): Promise<Account>
  createWithGoogle(
    authenticationWithGoogleToCreate: AuthenticationWithGoogleToCreate,
    accountToCreate: AccountToCreate
  ): Promise<Account>
  update(p: { accountId: string; account: Partial<Account> }): Promise<Account>
  findOneById(id: string): Promise<Account>
  findAllByIdIn(ids: string[]): Promise<Account[]>
  countAll(): Promise<number>
  findAll(): Promise<Account[]>
  findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Account>>
  findAuthenticationWithPasswordByAccountId(accountId: string): Promise<AuthenticationWithPassword>
  findAuthenticationWithGoogleByAccountId(accountId: string): Promise<AuthenticationWithGoogle>
  findByEmail(email: string): Promise<Account | undefined>
  findByPhoneNumber(phoneNumber: string): Promise<Account | undefined>
  updateAuthenticationWithPassword(
    accountId: string,
    authenticationWithPassword: Partial<AuthenticationWithPasswordToUpdate>
  ): Promise<AuthenticationWithPassword>
}
