import { JWTTokenVM } from './entities/JWTTokenVM'
import { RefreshTokenRequest } from './requests/RefreshTokenRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { AccountService } from '../../../../../domain/services/entities/account/AccountService'
import { AuthenticationWorkflowService } from '../../../../../domain/services/workflows/auth/AuthenticationWorkflowService'
import { Roles } from '../../decorators/RolesDecorator'
import { AccountVM } from '../accounts/entities/AccountVM'
import { CreateAccountMailPasswordRequest } from '../accounts/requests/CreateAccountMailPasswordRequest'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/admin/auth')
@ApiTags('AdminAuthentication')
export class AdminAuthenticationController {
  constructor(
    private authService: AuthenticationWorkflowService,
    private accountService: AccountService
  ) {}

  @ApiOkResponse()
  @Post('register/email')
  async adminRegisterWithEmail(@Body() emailPasswordRequest: CreateAccountMailPasswordRequest): Promise<AccountVM> {
    const toCreate = Account.toAccountToCreate({
      username: emailPasswordRequest.username,
      email: emailPasswordRequest.email,
      phoneNumber: emailPasswordRequest.phoneNumber,
      authority: Authority.ADMIN
    })
    const createdAccount = await this.authService.registerWithMailPassword({
      accountToCreate: toCreate,
      password: emailPasswordRequest.password
    })
    return AccountVM.from(createdAccount)
  }

  @ApiOkResponse()
  @Post('refresh')
  @Roles(Authority.ADMIN)
  @ApiBearerAuth()
  async refreshToken(@Body() req: RefreshTokenRequest): Promise<JWTTokenVM> {
    const token = await this.authService.refreshToken(req.refreshToken)
    return new JWTTokenVM(token)
  }
}
