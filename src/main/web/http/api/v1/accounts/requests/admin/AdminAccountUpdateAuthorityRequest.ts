import { Authority } from '../../../../../../../domain/models/accounts/Authority'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class AdminAccountUpdateAuthorityRequest {
  @ApiProperty({ isArray: true, enum: Authority, enumName: 'Authority', example: Object.values(Authority) })
  @IsEnum(Authority)
  readonly authority: Authority
}

export const AdminAccountUpdateAuthorityRequestExampleToAdmin = {
  authority: Authority.ADMIN
}

export const AdminAccountUpdateAuthorityRequestExampleToUser = {
  authority: Authority.USER
}
