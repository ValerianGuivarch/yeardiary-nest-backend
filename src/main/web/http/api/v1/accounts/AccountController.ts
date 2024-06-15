import { AccountVM, AccountVMExample } from './entities/AccountVM'
import { UpdateAccountProfileRequest } from './requests/UpdateAccountProfileRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { AccountService } from '../../../../../domain/services/entities/account/AccountService'
import { CurrentAccountDecorator } from '../../decorators/CurrentAccountDecorator'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { generateResponseContent } from '../../utils/swagger'
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/accounts')
@ApiTags('Account')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @ApiOkResponse({
    description: 'Get current account',
    content: generateResponseContent<AccountVM>({
      types: AccountVM,
      examples: {
        Example: AccountVMExample
      }
    })
  })
  @Roles(Authority.USER, Authority.ADMIN)
  @Get('me')
  async getAccount(@CurrentAccountDecorator() currentAccount: Account): Promise<AccountVM> {
    return AccountVM.from(currentAccount)
  }

  @ApiOkResponse({
    description: 'Update current account profile',
    content: generateResponseContent<AccountVM>({
      types: AccountVM,
      examples: {
        Example: AccountVMExample
      }
    })
  })
  @Roles(Authority.USER, Authority.ADMIN)
  @Put('me/profile')
  async updateAccountProfile(
    @CurrentAccountDecorator() currentAccount: Account,
    @Body() request: UpdateAccountProfileRequest
  ): Promise<AccountVM> {
    const updatedAccount = await this.accountService.updateAccountProfile({
      account: currentAccount,
      profile: {
        firstname: request.firstName,
        lastname: request.lastName
      }
    })
    return AccountVM.from(updatedAccount)
  }
}
