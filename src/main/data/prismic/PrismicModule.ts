import { PrismicCityProvider } from './cities/PrismicCityProvider'
import { PrismicContentProvider } from './contents/PrismicContentProvider'
import { PrismicProvider } from './PrismicProvider'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    PrismicProvider,
    {
      provide: 'IContentProvider',
      useClass: PrismicContentProvider
    },
    {
      provide: 'ICityProvider',
      useClass: PrismicCityProvider
    }
  ],
  exports: [
    PrismicProvider,
    {
      provide: 'IContentProvider',
      useClass: PrismicContentProvider
    },
    {
      provide: 'ICityProvider',
      useClass: PrismicCityProvider
    }
  ]
})
export class PrismicModule {}
