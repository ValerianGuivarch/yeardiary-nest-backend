import { AdminAccountVM, AdminAccountVMEAdminExample, AdminAccountVMUserExample } from './entities/admin/AdminAccountVM'
import { AdminAccountUpdateAuthorityRequest } from './requests/admin/AdminAccountUpdateAuthorityRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { AccountService } from '../../../../../domain/services/entities/account/AccountService'
import { CurrentAccountDecorator } from '../../decorators/CurrentAccountDecorator'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
import { PageVM } from '../../utils/paginations/PageVM'
import { generatePageResponseContent, generateResponseContent } from '../../utils/swagger'
import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/admin/accounts')
@ApiTags('AdminAccount')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Roles(Authority.ADMIN)
export class AdminAccountController {
  constructor(private accountService: AccountService) {}

  @ApiOkResponse({
    description: 'Accounts have been successfully retrieved.',
    content: generatePageResponseContent<AdminAccountVM>({
      types: AdminAccountVM,
      examples: {
        'Admin Example': AdminAccountVMEAdminExample,
        'User Example': AdminAccountVMUserExample,
        'All Example': [AdminAccountVMEAdminExample, AdminAccountVMUserExample]
      }
    })
  })
  @Get('')
  async getAllAccounts(
    @CurrentAccountDecorator() currentAccount: Account,
    @Query() pageOptionsRequest: PageOptionsRequest
  ): Promise<PageVM<AdminAccountVM>> {
    const page = await this.accountService.findAllPaginated({
      pageOptions: pageOptionsRequest.toPageOptions()
    })
    return PageVM.fromPage(page.map(AdminAccountVM.from))
  }

  @ApiOkResponse({
    description: 'Retrieve an account with the given id.',
    content: generateResponseContent<AdminAccountVM>({
      types: AdminAccountVM,
      examples: {
        'Admin Example': AdminAccountVMEAdminExample,
        'User Example': AdminAccountVMUserExample
      }
    })
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminAccountVM> {
    const results = await this.accountService.findOneById(id)
    return AdminAccountVM.from(results)
  }

  @ApiOkResponse({
    description: 'Account has been successfully retrieved.',
    content: generateResponseContent<AdminAccountVM>({
      types: AdminAccountVM,
      examples: {
        'Admin Example': AdminAccountVMEAdminExample,
        'User Example': AdminAccountVMUserExample
      }
    })
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() req: AdminAccountUpdateAuthorityRequest): Promise<AdminAccountVM> {
    const accountUpdated = await this.accountService.updateAccountAuthority(id, req.authority)
    return AdminAccountVM.from(accountUpdated)
  }
}
