import config from '../../../../config/configuration'
import { DomainErrors } from '../../../errors/DomainErrors'
import { EmailToken } from '../../../models/auth/EmailToken'
import { IEmailTokenProvider } from '../../../providers/email/IEmailTokenProvider'
import { IMailProvider } from '../../../providers/email/IMailProvider'
import { Inject, Injectable } from '@nestjs/common'
import { Chance } from 'chance'

@Injectable()
export class MailService {
  constructor(
    @Inject('IMailProvider') private readonly emailProvider: IMailProvider,
    @Inject('IEmailTokenProvider') private readonly emailTokenProvider: IEmailTokenProvider
  ) {}

  async sendInitAccountEmail(p: { accountId: string; email: string }): Promise<void> {
    let emailToken: EmailToken
    const existingEmailToken = await this.emailTokenProvider.findByAccountId(p.accountId)
    if (existingEmailToken && new Date() < existingEmailToken.expirationDate) {
      emailToken = existingEmailToken
    } else {
      const token = config().email.enabled
        ? new Chance().string({
            alpha: true,
            numeric: true,
            length: 35
          })
        : 'mockedmailtoken1234'
      const expirationDate = new Date()
      // Add 1 day
      expirationDate.setTime(expirationDate.getTime() + 1000 * 60 * 60 * 24)
      emailToken = await this.emailTokenProvider.create(
        EmailToken.toEmailTokenToCreate({
          accountId: p.accountId,
          token: token,
          expirationDate: expirationDate,
          createdDate: new Date()
        })
      )
    }
    const url = `${config().http}/auth/validate-email?email=${p.email}&token=${emailToken.token}`
    await this.emailProvider.sendMail({
      to: [p.email],
      subject: "Cos d'estournel account initialisation",
      html: url
    })
  }

  async validateEmailToken(accountId: string, token: string): Promise<boolean> {
    const emailToken = await this.emailTokenProvider.findOneByAccountId(accountId)
    if (emailToken.expirationDate < new Date()) {
      throw DomainErrors.ExpiredTokenEmail()
    }
    if (emailToken.token !== token) {
      throw DomainErrors.WrongToken()
    }
    return true
  }

  async deleteEmailTokenByAccountId(accountId: string): Promise<void> {
    await this.emailTokenProvider.deleteByAccountId(accountId)
  }

  async sendForgotPasswordEmail(p: { accountId: string; email: string }): Promise<void> {
    let emailToken: EmailToken
    const existingEmailToken = await this.emailTokenProvider.findByAccountId(p.accountId)
    if (existingEmailToken && new Date() < existingEmailToken.expirationDate) {
      emailToken = existingEmailToken
    } else {
      const token = config().email.enabled
        ? new Chance().string({
            alpha: true,
            numeric: true,
            length: 35
          })
        : 'mockedmailtoken1234'
      const expirationDate = new Date()
      // Add 1 day
      expirationDate.setTime(expirationDate.getTime() + 1000 * 60 * 60 * 24)
      emailToken = await this.emailTokenProvider.create(
        EmailToken.toEmailTokenToCreate({
          accountId: p.accountId,
          token: token,
          expirationDate: expirationDate,
          createdDate: new Date()
        })
      )
    }
    const url = `${config().http}/auth/init-password?email=${p.email}&token=${emailToken.token}`
    await this.emailProvider.sendMail({
      to: [p.email],
      subject: "Cos d'estournel password initialisation",
      html: url
    })
  }
}
