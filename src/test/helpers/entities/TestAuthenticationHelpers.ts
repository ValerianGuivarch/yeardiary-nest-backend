import { DBAccount } from '../../../main/data/database/accounts/DBAccount'
import { DBAuthenticationWithGoogle } from '../../../main/data/database/accounts/DBAuthenticationWithGoogle'
import { DBAuthenticationWithPassword } from '../../../main/data/database/accounts/DBAuthenticationWithPassword'
import { AuthenticationMethodName } from '../../../main/domain/models/auth/AuthenticationMethodName'
import {
  AuthenticationWithGoogle,
  AuthenticationWithGoogleToCreate
} from '../../../main/domain/models/auth/AuthenticationWithGoogle'
import {
  AuthenticationWithPassword,
  AuthenticationWithPasswordToCreate
} from '../../../main/domain/models/auth/AuthenticationWithPassword'
import { Chance } from 'chance'

export class TestAuthenticationHelpers {
  static chance = new Chance()

  static generateAuthenticationWithGoogleToCreate(): AuthenticationWithGoogleToCreate {
    return {
      googleId: this.chance.string(),
      hashedRefreshToken: this.chance.string()
    }
  }

  static generateAuthenticationWithGoogle(): AuthenticationWithGoogle {
    return {
      accountId: this.chance.guid(),
      googleId: this.chance.string(),
      hashedRefreshToken: this.chance.string(),
      id: this.chance.guid()
    }
  }

  static generateDBAuthenticationWithGoogle(linkedEntities: { account: DBAccount }): DBAuthenticationWithGoogle {
    return {
      account: undefined,
      accountId: linkedEntities.account.id,
      createdDate: this.chance.date(),
      googleId: this.chance.string(),
      hashedRefreshToken: this.chance.string(),
      id: this.chance.guid(),
      type: AuthenticationMethodName.GOOGLE,
      updatedDate: this.chance.date()
    }
  }

  static generateAuthenticationWithEmailToCreate(): AuthenticationWithPasswordToCreate {
    return { hashedPassword: this.chance.string() }
  }

  static generateAuthenticationWithPassword(): AuthenticationWithPassword {
    return {
      accountId: this.chance.guid(),
      hashedPassword: this.chance.string(),
      updatedDate: this.chance.date(),
      id: this.chance.guid()
    }
  }

  static generateDBAuthenticationWithPassword(linkedEntities: { account: DBAccount }): DBAuthenticationWithPassword {
    return {
      account: undefined,
      accountId: linkedEntities.account.id,
      createdDate: this.chance.date(),
      hashedPassword: this.chance.string(),
      id: this.chance.guid(),
      type: AuthenticationMethodName.EMAIL_PASSWORD,
      updatedDate: this.chance.date()
    }
  }
}
