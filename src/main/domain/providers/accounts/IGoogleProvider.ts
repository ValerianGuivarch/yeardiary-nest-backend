import { GoogleUserInfo } from '../../../data/google/GoogleUserInfo'
import { Credentials } from 'google-auth-library'

export interface IGoogleProvider {
  generateAuthUrl(): string
  getTokens(code: string): Promise<Credentials>
  getUserInfo(tokens: Credentials): Promise<GoogleUserInfo>
  refreshToken(refreshToken: string): Promise<Credentials>
}
