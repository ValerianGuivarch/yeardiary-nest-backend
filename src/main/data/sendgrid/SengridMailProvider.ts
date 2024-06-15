import config from '../../config/configuration'
import { IMailProvider } from '../../domain/providers/email/IMailProvider'
import { Injectable } from '@nestjs/common'
import sgMail from '@sendgrid/mail'

@Injectable()
export class SendgridMailProvider implements IMailProvider {
  constructor() {
    sgMail.setApiKey(config().sendgrid.apiKey)
  }

  async sendMail({ to, subject, html }: { to: string[]; subject: string; html: string }): Promise<void> {
    const msg = {
      to,
      from: config().sendgrid.senderMail,
      subject,
      html
    }

    await sgMail.send(msg)
  }
}
