import { GoogleUserInfo } from './GoogleUserInfo'
import config from '../../config/configuration'
import { IGoogleProvider } from '../../domain/providers/accounts/IGoogleProvider'
import { Injectable, Logger } from '@nestjs/common'
import { Credentials, OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

@Injectable()
export class GoogleProvider implements IGoogleProvider {
  private readonly logger = new Logger(GoogleProvider.name)

  static readonly GOOGLE_CALLBACK_URL = '/api/v1/auth/google/callback'

  constructor() {}

  private createOAuth2Client(): OAuth2Client {
    return new OAuth2Client(
      config().google.clientId,
      config().google.clientSecret,
      `http://${config().http.host}:${config().http.port}${GoogleProvider.GOOGLE_CALLBACK_URL}`
    )
  }

  generateAuthUrl(): string {
    const oauth2Client = this.createOAuth2Client()
    const scopes = ['email', 'profile']
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })
  }

  async getTokens(code: string): Promise<Credentials> {
    const oauth2Client = this.createOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code)
    return tokens
  }

  async refreshToken(refreshToken: string): Promise<Credentials> {
    const oauth2Client = this.createOAuth2Client()
    oauth2Client.setCredentials({ refresh_token: refreshToken })
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials
  }

  async getUserInfo(tokens: Credentials): Promise<GoogleUserInfo> {
    const oauth2Client = this.createOAuth2Client()
    oauth2Client.setCredentials(tokens)
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client
    })

    try {
      const userInfoResponse = await oauth2.userinfo.get()
      return userInfoResponse.data as GoogleUserInfo
    } catch (error) {
      this.logger.error('Failed to retrieve user information from Google.', error)
      throw new Error('Failed to retrieve user information from Google.')
    }
  }
}
