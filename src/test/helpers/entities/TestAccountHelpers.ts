import { DBAccount } from '../../../main/data/database/accounts/DBAccount'
import { Account, AccountToCreate } from '../../../main/domain/models/accounts/Account'
import { Authority } from '../../../main/domain/models/accounts/Authority'
import { Chance } from 'chance'

export class TestAccountHelpers {
  static chance = new Chance()

  static generateAccountToCreate(): AccountToCreate {
    return {
      authority: Authority.USER,
      email: this.chance.email(),
      phoneNumber: this.chance.phone(),
      profile: {
        firstname: '',
        lastname: ''
      },
      secret: this.chance.string(),
      username: this.chance.string()
    }
  }

  static generateAccount(): Account {
    return {
      authority: Authority.USER,
      createdDate: this.chance.date(),
      email: this.chance.email(),
      id: this.chance.guid(),
      phoneNumber: this.chance.phone(),
      profile: { firstname: this.chance.string(), lastname: this.chance.string() },
      secret: this.chance.string(),
      updatedDate: this.chance.date(),
      username: this.chance.string()
    }
  }

  static generateDBAccount(): DBAccount {
    return {
      authority: Authority.USER,
      createdDate: this.chance.date(),
      email: this.chance.email(),
      id: this.chance.guid(),
      phoneNumber: this.chance.phone(),
      firstname: this.chance.string(),
      lastname: this.chance.string(),
      secret: this.chance.guid(),
      updatedDate: this.chance.date(),
      username: this.chance.string()
    }
  }
}
