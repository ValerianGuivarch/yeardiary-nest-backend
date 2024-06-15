import { GoogleUserInfo } from '../../../../data/google/GoogleUserInfo'
import { IAccountProvider } from '../../../providers/accounts/IAccountProvider'
import { IGoogleProvider } from '../../../providers/accounts/IGoogleProvider'
import { ITokenProvider } from '../../../providers/accounts/ITokenProvider'
import { IMailProvider } from '../../../providers/email/IMailProvider'
import { ISmsProvider } from '../../../providers/sms/ISmsProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Credentials } from 'google-auth-library'

@Injectable()
export class GoogleAuthenticationService {
  private readonly logger = new Logger(GoogleAuthenticationService.name)
  constructor(
    @Inject('IAccountProvider')
    private accountProvider: IAccountProvider,
    @Inject('ITokenProvider')
    private tokenProvider: ITokenProvider,
    @Inject('IGoogleProvider')
    private googleProvider: IGoogleProvider,
    @Inject('IMailProvider')
    private mailProvider: IMailProvider,
    @Inject('ISmsProvider')
    private smsProvider: ISmsProvider
  ) {
    console.log('GoogleAuthenticationService')
  }

  generateGoogleAuthUrl(): string {
    return this.googleProvider.generateAuthUrl()
  }

  async getTokens(code: string): Promise<Credentials> {
    this.logger.verbose('getTokens > Google[Credentials] > Credentials')
    return this.googleProvider.getTokens(code)
  }

  async getUserInfo(googleCredentials: Credentials): Promise<GoogleUserInfo> {
    this.logger.verbose('getUserInfo > Google[Credentials] > GoogleUserInfo')
    return this.googleProvider.getUserInfo(googleCredentials)
  }
}
