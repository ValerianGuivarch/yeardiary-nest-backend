import { JWTTokenVM, JWTTokenVMExample } from './entities/JWTTokenVM'
import { ForgotPasswordRequest, ForgotPasswordRequestExample } from './requests/ForgotPasswordRequest'
import { RefreshTokenRequest } from './requests/RefreshTokenRequest'
import { SignInByEmailAndPasswordRequest } from './requests/SignInByEmailAndPasswordRequest'
import { UpdatePasswordRequest, UpdatePasswordRequestExample } from './requests/UpdatePasswordRequest'
import { ValidateEmailRequest, ValidateEmailRequestExample } from './requests/ValidateEmailRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { GoogleAuthenticationService } from '../../../../../domain/services/entities/auth/GoogleAuthenticationService'
import { AuthenticationWorkflowService } from '../../../../../domain/services/workflows/auth/AuthenticationWorkflowService'
import { Roles } from '../../decorators/RolesDecorator'
import { generateRequestSchemasAndExamples, generateResponseContent } from '../../utils/swagger'
import { AccountVM } from '../accounts/entities/AccountVM'
import { CreateAccountMailPasswordRequest } from '../accounts/requests/CreateAccountMailPasswordRequest'
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query, Redirect } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/auth')
@ApiTags('Authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name)

  constructor(
    private authService: AuthenticationWorkflowService,
    private readonly googleAuthService: GoogleAuthenticationService
  ) {}

  @ApiOkResponse()
  @Post('register-email')
  async registerWithEmail(@Body() emailPasswordRequest: CreateAccountMailPasswordRequest): Promise<AccountVM> {
    const toCreate = Account.toAccountToCreate({
      username: emailPasswordRequest.username,
      email: emailPasswordRequest.email,
      phoneNumber: emailPasswordRequest.phoneNumber,
      authority: Authority.USER
    })
    const createdAccount = await this.authService.registerWithMailPassword({
      accountToCreate: toCreate,
      password: emailPasswordRequest.password
    })
    return AccountVM.from(createdAccount)
  }

  @ApiOkResponse()
  @Get('google')
  @Redirect()
  googleAuth(): { url: string } {
    const url = this.googleAuthService.generateGoogleAuthUrl()
    return { url }
  }

  @ApiOkResponse()
  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string): Promise<JWTTokenVM> {
    return JWTTokenVM.from(await this.authService.signInWithGoogle({ code: code }))
  }

  @ApiOkResponse()
  @Post('refresh')
  @Roles(Authority.USER)
  @ApiBearerAuth()
  async refreshToken(@Body() req: RefreshTokenRequest): Promise<JWTTokenVM> {
    const token = await this.authService.refreshToken(req.refreshToken)
    this.logger.warn(token)
    return new JWTTokenVM(token)
  }

  @ApiOkResponse()
  @Post('')
  async login(@Body() request: SignInByEmailAndPasswordRequest): Promise<JWTTokenVM> {
    return JWTTokenVM.from(
      await this.authService.signInWithEmailAndPassword({ email: request.email, password: request.password })
    )
  }

  @ApiOkResponse({
    description: 'Validate a token to finish the account creation',
    content: generateResponseContent<JWTTokenVM>({
      types: JWTTokenVM,
      examples: {
        Example: JWTTokenVMExample
      }
    })
  })
  @ApiQuery({
    name: 'email',
    description: 'The email to validate',
    example: ValidateEmailRequestExample.email
  })
  @ApiQuery({
    name: 'token',
    description: 'The token to validate',
    example: ValidateEmailRequestExample.token
  })
  @ApiBody({
    description: 'Validate an email',
    required: true,
    ...generateRequestSchemasAndExamples<ValidateEmailRequest>({
      types: ValidateEmailRequest,
      examples: {
        Example: ValidateEmailRequestExample
      }
    })
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('validate-email')
  async validateAccountCreation(@Query() validateEmailRequest: ValidateEmailRequest): Promise<JWTTokenVM> {
    return JWTTokenVM.from(
      await this.authService.validateAccountEmailCreation({
        email: validateEmailRequest.email,
        token: validateEmailRequest.token
      })
    )
  }

  @ApiCreatedResponse({
    description: 'Send an email to reset the password'
  })
  @ApiBody({
    description: 'Send an email to reset the password',
    required: true,
    ...generateRequestSchemasAndExamples<ForgotPasswordRequest>({
      types: ForgotPasswordRequest,
      examples: {
        Example: ForgotPasswordRequestExample
      }
    })
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordRequest: ForgotPasswordRequest): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordRequest.email)
  }

  @ApiOkResponse({
    description: 'Update the password'
  })
  @ApiBody({
    description: 'Update the password',
    required: true,
    ...generateRequestSchemasAndExamples<UpdatePasswordRequest>({
      types: UpdatePasswordRequest,
      examples: {
        Example: UpdatePasswordRequestExample
      }
    })
  })
  @HttpCode(HttpStatus.OK)
  @Post('update-password')
  async updatePassword(@Body() updatePasswordRequest: UpdatePasswordRequest): Promise<JWTTokenVM> {
    return await this.authService.updatePassword({
      email: updatePasswordRequest.email,
      token: updatePasswordRequest.token,
      newPassword: updatePasswordRequest.password
    })
  }
}
