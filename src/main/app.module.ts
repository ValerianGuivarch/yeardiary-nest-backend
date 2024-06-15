import config from './config/configuration'
import { PostgresModule } from './data/database/postgres.module'
import { DiaryService } from './domain/services/entities/diaries/DiaryService'
import { DiaryController } from './web/http/api/v1/diaries/DiaryController'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    PostgresModule,
    FastifyMulterModule
  ],
  controllers: [
    DiaryController
  ],
  providers: [
    DiaryService
  ]
})
export class AppModule {}
