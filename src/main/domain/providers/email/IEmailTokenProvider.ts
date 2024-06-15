import { EmailToken, EmailTokenToCreate } from '../../models/auth/EmailToken'

export interface IEmailTokenProvider {
  create(emailToken: EmailTokenToCreate): Promise<EmailToken>
  findOneByAccountId(accountId: string): Promise<EmailToken>
  findByAccountId(accountId: string): Promise<EmailToken | undefined>
  deleteByAccountId(accountId: string): Promise<void>
}
