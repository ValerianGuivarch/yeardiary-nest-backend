import { DBAccount, DBAccountToCreate, DBAccountToUpdate } from './DBAccount'
import { DBAuthenticationMethod } from './DBAuthenticationMethod'
import { DBAuthenticationWithGoogle, DBAuthenticationWithGoogleToCreate } from './DBAuthenticationWithGoogle'
import { DBAuthenticationWithPassword, DBAuthenticationWithPasswordToCreate } from './DBAuthenticationWithPassword'
import { filterNullAndUndefinedAndEmpty } from '../../../domain/helpers/ArraysHelpers'
import { Account, AccountToCreate } from '../../../domain/models/accounts/Account'
import { AuthenticationMethodName } from '../../../domain/models/auth/AuthenticationMethodName'
import {
  AuthenticationWithGoogle,
  AuthenticationWithGoogleToCreate
} from '../../../domain/models/auth/AuthenticationWithGoogle'
import {
  AuthenticationWithPassword,
  AuthenticationWithPasswordToCreate,
  AuthenticationWithPasswordToUpdate
} from '../../../domain/models/auth/AuthenticationWithPassword'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { IAccountProvider } from '../../../domain/providers/accounts/IAccountProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, EntityManager } from 'typeorm'

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class DBAccountProvider implements IAccountProvider {
  private readonly logger = new Logger(DBAccountProvider.name)
  private static readonly RELATIONS = []
  constructor(
    private readonly manager: EntityManager,
    @InjectRepository(DBAccount)
    private readonly accountRepository: Repository<DBAccount>,
    @InjectRepository(DBAuthenticationMethod)
    private readonly authenticationMethodRepository: Repository<DBAuthenticationMethod>,
    @InjectRepository(DBAuthenticationWithPassword)
    private readonly authenticationWithMailPasswordRepository: Repository<DBAuthenticationWithPassword>,
    @InjectRepository(DBAuthenticationWithGoogle)
    private readonly authenticationWithGoogleRepository: Repository<DBAuthenticationWithGoogle>
  ) {}

  private static toAccount(doc: DBAccount): Account {
    return new Account({
      id: doc.id,
      profile: {
        firstname: doc.firstname,
        lastname: doc.lastname
      },
      authority: doc.authority,
      secret: doc.secret,
      creationState: doc.creationState,
      username: doc.username,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      createdDate: doc.createdDate,
      updatedDate: doc.updatedDate
    })
  }

  private static toAuthenticationWithPassword(
    dbAuthenticationWithPassword: DBAuthenticationWithPassword
  ): AuthenticationWithPassword {
    return new AuthenticationWithPassword({
      id: dbAuthenticationWithPassword.id,
      accountId: dbAuthenticationWithPassword.accountId,
      hashedPassword: dbAuthenticationWithPassword.hashedPassword,
      updatedDate: dbAuthenticationWithPassword.updatedDate
    })
  }

  private static toAuthenticationWithGoogle(
    dbAuthenticationWithGoogle: DBAuthenticationWithGoogle
  ): AuthenticationWithGoogle {
    return new AuthenticationWithGoogle({
      id: dbAuthenticationWithGoogle.id,
      accountId: dbAuthenticationWithGoogle.accountId,
      googleId: dbAuthenticationWithGoogle.googleId,
      hashedRefreshToken: dbAuthenticationWithGoogle.hashedRefreshToken
    })
  }

  async createWithMailPassword(
    authenticationMethod: AuthenticationWithPasswordToCreate,
    account: AccountToCreate
  ): Promise<Account> {
    let accountId: string
    await this.manager.transaction(async (transactionalEntityManager) => {
      const accountToCreate: DBAccountToCreate = {
        username: account.username,
        phoneNumber: account.phoneNumber,
        createdDate: new Date(),
        updatedDate: new Date(),
        firstname: '',
        lastname: '',
        email: account.email,
        secret: account.secret,
        creationState: account.creationState,
        authority: account.authority
      }
      const createdAccount = transactionalEntityManager.create(DBAccount, accountToCreate)
      const insertResult = await transactionalEntityManager.insert(DBAccount, createdAccount)
      if (insertResult.identifiers.length === 0) {
        throw ProviderErrors.accountNotCreated()
      }
      accountId = insertResult.identifiers[0].id
      const authenticationMethodToCreate: DBAuthenticationWithPasswordToCreate = {
        type: AuthenticationMethodName.EMAIL_PASSWORD,
        accountId: accountId,
        hashedPassword: authenticationMethod.hashedPassword,
        createdDate: new Date(),
        updatedDate: new Date()
      }
      const createdAuth = transactionalEntityManager.create(DBAuthenticationWithPassword, authenticationMethodToCreate)
      await transactionalEntityManager.insert(DBAuthenticationWithPassword, createdAuth)
    })
    return this.findOneById(accountId)
  }

  async createWithGoogle(
    authenticationMethod: AuthenticationWithGoogleToCreate,
    account: AccountToCreate
  ): Promise<Account> {
    let accountId: string
    await this.manager.transaction(async (transactionalEntityManager) => {
      const accountToCreate: DBAccountToCreate = {
        username: account.username,
        createdDate: new Date(),
        updatedDate: new Date(),
        firstname: '',
        lastname: '',
        email: account.email,
        creationState: account.creationState,
        phoneNumber: account.phoneNumber,
        secret: account.secret,
        authority: account.authority
      }
      const createdAccount = transactionalEntityManager.create(DBAccount, accountToCreate)
      const insertResult = await transactionalEntityManager.insert(DBAccount, createdAccount)
      accountId = insertResult.identifiers[0].id

      if (insertResult.identifiers.length === 0) {
        throw ProviderErrors.accountNotCreated()
      }

      const authenticationMethodToCreate: DBAuthenticationWithGoogleToCreate = {
        type: AuthenticationMethodName.GOOGLE,
        accountId: accountId,
        googleId: authenticationMethod.googleId,
        hashedRefreshToken: authenticationMethod.hashedRefreshToken,
        createdDate: new Date(),
        updatedDate: new Date()
      }
      const createdAuth = transactionalEntityManager.create(DBAuthenticationWithGoogle, authenticationMethodToCreate)
      await transactionalEntityManager.insert(DBAuthenticationWithGoogle, createdAuth)
    })
    return this.findOneById(accountId)
  }

  async update(p: { accountId: string; account: Partial<Account> }): Promise<Account> {
    const accountToUpdate: Partial<DBAccountToUpdate> = {
      email: p.account.email,
      username: p.account.username,
      firstname: p.account.profile?.firstname,
      lastname: p.account.profile?.lastname,
      authority: p.account.authority,
      updatedDate: new Date()
    }
    await this.accountRepository.update({ id: p.accountId }, accountToUpdate)
    return this.findOneById(p.accountId)
  }

  async findById(id: string): Promise<Account | undefined> {
    const account = await this.accountRepository.findOne({
      where: {
        id: id
      },
      relations: DBAccountProvider.RELATIONS
    })
    if (!account) {
      return undefined
    }
    return DBAccountProvider.toAccount(account)
  }

  async findOneById(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        id: id
      },
      relations: DBAccountProvider.RELATIONS
    })
    if (!account) {
      throw ProviderErrors.EntityNotFound(Account.name + ' ' + id)
    }
    return DBAccountProvider.toAccount(account)
  }

  async countAll(): Promise<number> {
    return this.accountRepository.count()
  }

  async findAllByIdIn(ids: string[]): Promise<Account[]> {
    const results = await this.accountRepository.find({
      where: {
        id: In(ids.filter(filterNullAndUndefinedAndEmpty()))
      },
      relations: DBAccountProvider.RELATIONS
    })
    return results.map((entity) => DBAccountProvider.toAccount(entity))
  }

  async findAll(): Promise<Account[]> {
    const result = await this.accountRepository.find()
    return result.map((doc) => DBAccountProvider.toAccount(doc))
  }

  async findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Account>> {
    const [result, total] = await this.accountRepository.findAndCount({
      take: p.pageOptions.perPage,
      skip: p.pageOptions.skip
    })
    return new Page<Account>({
      items: result.map(DBAccountProvider.toAccount),
      total: total,
      pageOptions: p.pageOptions
    })
  }

  async findAuthenticationWithPasswordByAccountId(accountId: string): Promise<AuthenticationWithPassword> {
    const authenticationWithMailPassword = await this.authenticationWithMailPasswordRepository.findOne({
      where: {
        accountId: accountId
      }
    })
    if (!authenticationWithMailPassword) {
      throw ProviderErrors.EntityNotFound('AuthenticationWithPassword ' + accountId)
    }
    return DBAccountProvider.toAuthenticationWithPassword(authenticationWithMailPassword)
  }

  async findAuthenticationWithGoogleByAccountId(accountId: string): Promise<AuthenticationWithGoogle> {
    const authenticationWithGoogle = await this.authenticationWithGoogleRepository.findOne({
      where: {
        accountId: accountId
      }
    })
    if (!authenticationWithGoogle) {
      throw ProviderErrors.EntityNotFound('AuthenticationWithGoogle ' + accountId)
    }
    return DBAccountProvider.toAuthenticationWithGoogle(authenticationWithGoogle)
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const account = await this.accountRepository.findOne({
      where: {
        email: email
      },
      relations: DBAccountProvider.RELATIONS
    })
    if (!account) {
      return undefined
    } else {
      return DBAccountProvider.toAccount(account)
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Account | undefined> {
    const account = await this.accountRepository.findOne({
      where: {
        phoneNumber: phoneNumber
      },
      relations: DBAccountProvider.RELATIONS
    })
    if (!account) {
      return undefined
    } else {
      return DBAccountProvider.toAccount(account)
    }
  }

  async updateAuthenticationWithPassword(
    accountId: string,
    authenticationWithPassword: Partial<AuthenticationWithPasswordToUpdate>
  ): Promise<AuthenticationWithPassword> {
    const toUpdate: Partial<AuthenticationWithPasswordToUpdate> = {
      hashedPassword: authenticationWithPassword.hashedPassword,
      updatedDate: new Date()
    }
    await this.authenticationWithMailPasswordRepository.update({ accountId: accountId }, toUpdate)
    return this.findAuthenticationWithPasswordByAccountId(accountId)
  }
}
