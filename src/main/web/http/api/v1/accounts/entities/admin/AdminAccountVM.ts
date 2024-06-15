import { Account } from '../../../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../../../domain/models/accounts/Authority'
import { ProfileVM, ProfileVMExample } from '../ProfileVM'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AdminAccountVM {
  @ApiProperty({ description: 'The account id', type: String, format: 'uuid' })
  id: string

  @ApiProperty({ isArray: true, enum: Authority, enumName: 'Authority' })
  authority: Authority

  @ApiProperty({ description: 'The account username', type: String })
  username: string

  @ApiProperty({ description: 'The account email', type: String })
  email: string

  @ApiPropertyOptional({ description: 'The account profile', type: ProfileVM })
  profile?: ProfileVM

  @ApiProperty({ description: 'The account creation date', type: Date })
  createdDate: Date

  @ApiProperty({ description: 'The account update date', type: Date })
  updatedDate: Date

  constructor(p: AdminAccountVM) {
    this.id = p.id
    this.authority = p.authority
    this.username = p.username
    this.email = p.email
    this.profile = p.profile
    this.createdDate = p.createdDate
    this.updatedDate = p.updatedDate
  }

  static from(account: Account): AdminAccountVM {
    return new AdminAccountVM({
      id: account.id,
      authority: account.authority,
      username: account.username,
      email: account.email,
      profile: account.profile ? ProfileVM.from(account.profile) : undefined,
      createdDate: account.createdDate,
      updatedDate: account.updatedDate
    })
  }
}

export const AdminAccountVMEAdminExample: AdminAccountVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  authority: Authority.ADMIN,
  username: 'john_doe_admin',
  email: '8pZi8@example.com',
  profile: ProfileVMExample,
  createdDate: new Date(),
  updatedDate: new Date()
}

export const AdminAccountVMUserExample: AdminAccountVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  authority: Authority.USER,
  username: 'john_doe',
  email: '8pZi8@example.com',
  profile: ProfileVMExample,
  createdDate: new Date(),
  updatedDate: new Date()
}
