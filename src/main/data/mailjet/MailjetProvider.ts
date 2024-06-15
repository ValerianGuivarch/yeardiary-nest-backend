import config from '../../config/configuration'
import { IMailProvider } from '../../domain/providers/email/IMailProvider'
import { Injectable } from '@nestjs/common'
import { Client } from 'node-mailjet'

@Injectable()
export class MailjetProvider implements IMailProvider {
  private mailjetSmsClient: Client

  constructor() {
    this.mailjetSmsClient = new Client({
      apiKey: config().mailjet.apiKey,
      apiSecret: config().mailjet.apiKeySecret
    })
  }

  async sendMail(p: { to: string[]; subject: string; html: string }): Promise<void> {
    await this.mailjetSmsClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: config().mailjet.emailFrom,
            Name: config().mailjet.emailFromName
          },
          To: p.to.map((to) => {
            return {
              Email: to
            }
          }),
          Subject: p.subject,
          HTMLPart: p.html
        }
      ]
    })
  }
}
