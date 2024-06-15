import config from '../../config/configuration'
import { ISmsProvider } from '../../domain/providers/sms/ISmsProvider'
import { Injectable } from '@nestjs/common'
import { Twilio } from 'twilio'

@Injectable()
export class TwilioSmsProvider implements ISmsProvider {
  private twilio: Twilio
  private readonly messagingService: string

  constructor() {
    this.twilio = new Twilio(config().twilio.accountSid, config().twilio.authToken)
    this.messagingService = config().twilio.messagingService
  }

  async send(phone: string, text: string): Promise<void> {
    await this.twilio.messages.create({
      messagingServiceSid: this.messagingService,
      to: phone,
      body: text
    })
  }
}
