import { MailjetProvider } from './MailjetProvider'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    {
      provide: 'IMailProvider',
      useClass: MailjetProvider
    }
  ],
  exports: [
    {
      provide: 'IMailProvider',
      useClass: MailjetProvider
    }
  ]
})
export class MailjetModule {}
