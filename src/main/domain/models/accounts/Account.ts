import { AccountState } from './AccountState'
import { Authority } from './Authority'
import { v4 as randomUuid } from 'uuid'

export class Account {
  id: string
  createdDate: Date
  updatedDate: Date
  secret: string
  creationState: AccountState
  authority: Authority
  profile: Profile
  email: string
  username: string
  phoneNumber?: string

  constructor(account: Account) {
    this.id = account.id
    this.createdDate = account.createdDate
    this.updatedDate = account.updatedDate
    this.secret = account.secret
    this.creationState = account.creationState
    this.authority = account.authority
    this.username = account.username
    this.profile = {
      firstname: account.profile.firstname,
      lastname: account.profile.lastname
    }
    this.email = account.email
    this.phoneNumber = account.phoneNumber
  }

  static toAccountToCreate(p: {
    authority: Authority
    email: string
    username: string
    phoneNumber?: string
  }): AccountToCreate {
    return {
      username: p.username,
      creationState: AccountState.PENDING,
      profile: {
        firstname: '',
        lastname: ''
      },
      email: p.email,
      phoneNumber: p.phoneNumber,
      secret: randomUuid(),
      authority: p.authority
    }
  }
}

export type Profile = {
  firstname: string
  lastname: string
}

export type AccountToCreate = Omit<Account, 'id' | 'createdDate' | 'updatedDate'>
