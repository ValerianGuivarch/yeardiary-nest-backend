import { TwilioSmsProvider } from './TwilioSmsProvider'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    {
      provide: 'ISmsProvider',
      useClass: TwilioSmsProvider
    }
  ],
  exports: [
    {
      provide: 'ISmsProvider',
      useClass: TwilioSmsProvider
    }
  ]
})
export class TwilioModule {}
