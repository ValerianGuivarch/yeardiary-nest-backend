import { CloudinaryProvider } from './CloudinaryProvider'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [
    {
      provide: 'ICloudImageProvider',
      useClass: CloudinaryProvider
    }
  ],
  exports: [
    {
      provide: 'ICloudImageProvider',
      useClass: CloudinaryProvider
    }
  ]
})
export class CloudinaryModule {}
