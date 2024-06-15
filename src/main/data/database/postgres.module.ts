import { MigrationsProvider } from './migrations/MigrationsProvider'
import { DBDiary } from './diaries/DBDiary'
import { DBDiaryProvider } from './diaries/DBDiaryProvider'
import config from '../../config/configuration'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InitDb1718445801 } from './migrations/1718445801-init-db'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DBDiary,
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        name: 'postgres',
        type: 'postgres',
        host: config().postgres.host,
        port: config().postgres.port,
        username: config().postgres.username,
        password: config().postgres.password,
        database: config().postgres.database,
        autoLoadEntities: config().postgres.autoLoadEntities,
        synchronize: false,
        entities: [
          DBDiary,
        ],
        migrations: [
          InitDb1718445801,
        ]
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    MigrationsProvider,
    {
      provide: 'IDiaryProvider',
      useClass: DBDiaryProvider
    }
  ],
  exports: [
    TypeOrmModule,
    {
      provide: 'IDiaryProvider',
      useClass: DBDiaryProvider
    },
  ]
})
export class PostgresModule {}
