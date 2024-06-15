import { ProfileVM, ProfileVMExample } from './ProfileVM'
import { Account } from '../../../../../../domain/models/accounts/Account'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AccountVM {
  @ApiProperty({ description: 'The account id', type: String, format: 'uuid' })
  id: string

  @ApiProperty({ description: 'The account username', type: String })
  username: string

  @ApiProperty({ description: 'The account email', type: String })
  email: string

  @ApiPropertyOptional({ description: 'The account profile', type: ProfileVM })
  profile?: ProfileVM

  constructor(account: AccountVM) {
    this.id = account.id
    this.email = account.email
    this.username = account.username
    this.profile = account.profile
  }

  static from(account: Account): AccountVM {
    return new AccountVM({
      id: account.id.toString(),
      profile: ProfileVM.from(account.profile),
      username: account.username,
      email: account.email
    })
  }
}

export const AccountVMExample: AccountVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  profile: ProfileVMExample,
  username: 'john_doe',
  email: '8pZi8@example.com'
}
