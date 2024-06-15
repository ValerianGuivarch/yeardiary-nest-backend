import config from './config/configuration'
import { CloudinaryModule } from './data/cloudinary/cloudinary.module'
import { PostgresModule } from './data/database/postgres.module'
import { GoogleProvider } from './data/google/GoogleProvider'
import { PrismicModule } from './data/prismic/PrismicModule'
import { JwtTokenProvider } from './data/security/JwtTokenProvider'
import { SendgridModule } from './data/sendgrid/SendgridModule'
import { TwilioModule } from './data/twilio/TwilioModule'
import { AccountService } from './domain/services/entities/account/AccountService'
import { GoogleAuthenticationService } from './domain/services/entities/auth/GoogleAuthenticationService'
import { BattleService } from './domain/services/entities/battles/BattleService'
import { CharacterService } from './domain/services/entities/characters/CharacterService'
import { ClasseService } from './domain/services/entities/classes/ClasseService'
import { ContentService } from './domain/services/entities/contents/ContentService'
import { GuildService } from './domain/services/entities/guilds/GuildService'
import { JWTTokenService } from './domain/services/entities/jwt_token/JWTTokenService'
import { RaceService } from './domain/services/entities/races/RaceService'
import { SettingService } from './domain/services/entities/settings/SettingService'
import { SkillService } from './domain/services/entities/skills/SkillService'
import { AuthenticationWorkflowService } from './domain/services/workflows/auth/AuthenticationWorkflowService'
import { BattleActionService } from './domain/services/workflows/battle_action/BattleActionService'
import { AccountController } from './web/http/api/v1/accounts/AccountController'
import { AdminAccountController } from './web/http/api/v1/accounts/AdminAccountController'
import { AuthenticationController } from './web/http/api/v1/auth/AuthenticationController'
import { BattleController } from './web/http/api/v1/battles/BattleController'
import { CharacterController } from './web/http/api/v1/characters/CharacterController'
import { ClasseController } from './web/http/api/v1/classes/ClasseController'
import { ContentController } from './web/http/api/v1/contents/ContentController'
import { GuildController } from './web/http/api/v1/guilds/GuildController'
import { RaceController } from './web/http/api/v1/races/RaceController'
import { AdminSettingController } from './web/http/api/v1/settings/AdminSettingController'
import { SettingController } from './web/http/api/v1/settings/SettingController'
import { SkillController } from './web/http/api/v1/skills/SkillController'
import { ChatGateway } from './web/ws/api/v1/chat/ChatGateway'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    PostgresModule,
    CloudinaryModule,
    TwilioModule,
    PrismicModule,
    SendgridModule,
    JwtModule.register({
      secret: config().JwtService.jwtSecret,
      signOptions: { expiresIn: '60s' }
    }),
    FastifyMulterModule
  ],
  controllers: [
    AccountController,
    AdminAccountController,
    CharacterController,
    AuthenticationController,
    SettingController,
    AdminSettingController,
    GuildController,
    ClasseController,
    SkillController,
    RaceController,
    BattleController,
    ContentController
  ],
  providers: [
    GoogleAuthenticationService,
    AccountService,
    JwtService,
    CharacterService,
    SettingService,
    RaceService,
    GuildService,
    ContentService,
    ClasseService,
    BattleActionService,
    ChatGateway,
    SkillService,
    BattleService,
    ContentService,
    AuthenticationWorkflowService,
    JWTTokenService,
    {
      provide: 'ITokenProvider',
      useClass: JwtTokenProvider
    },
    {
      provide: 'IGoogleProvider',
      useClass: GoogleProvider
    }
  ]
})
export class AppModule {}
