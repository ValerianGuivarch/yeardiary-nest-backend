import { SendgridMailProvider } from './SengridMailProvider'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    {
      provide: 'IMailProvider',
      useClass: SendgridMailProvider
    }
  ],
  exports: [
    {
      provide: 'IMailProvider',
      useClass: SendgridMailProvider
    }
  ]
})
export class SendgridModule {}
