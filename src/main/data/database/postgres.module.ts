import { DBAccount } from './accounts/DBAccount'
import { DBAccountProvider } from './accounts/DBAccountProvider'
import { DBAuthenticationMethod } from './accounts/DBAuthenticationMethod'
import { DBAuthenticationWithGoogle } from './accounts/DBAuthenticationWithGoogle'
import { DBAuthenticationWithPassword } from './accounts/DBAuthenticationWithPassword'
import { DBBattle } from './battles/DBBattle'
import { DBBattleProvider } from './battles/DBBattleProvider'
import { DBCharacterBattle } from './character_battle/DBCharacterBattle'
import { DBCharacterBattleProvider } from './character_battle/DBCharacterBattleProvider'
import { DBCharacterClasse } from './character_classes/DBCharacterClasse'
import { DBCharacterClasseProvider } from './character_classes/DBCharacterClasseProvider'
import { DBCharacter } from './characters/DBCharacter'
import { DBCharacterProvider } from './characters/DBCharacterProvider'
import { DBClasse } from './classes/DBClasse'
import { DBClasseProvider } from './classes/DBClasseProvider'
import { DBClasseSkill } from './classes_skills/DBClasseSkill'
import { DBGuild } from './guilds/DBGuild'
import { DBGuildProvider } from './guilds/DBGuildProvider'
import { DBGuildMember } from './guilds_members/DBGuildMember'
import { DBGuildMemberProvider } from './guilds_members/DBGuildMemberProvider'
import { DBItem } from './items/DBItem'
import { InitDb1698398468721 } from './migrations/1698398468721-init-db'
import { InitRaces1698933061831 } from './migrations/1698933061831-init-races'
import { AddSettings1698993525000 } from './migrations/1698993525000-add-settings'
import { AddItems1702544225000 } from './migrations/1702544225000-add-items'
import { Skills1703068337272 } from './migrations/1703068337272-skills'
import { Battle1703177293144 } from './migrations/1703177293144-battle'
import { MigrationsProvider } from './migrations/MigrationsProvider'
import { DBRace } from './races/DBRace'
import { DBRaceProvider } from './races/DBRaceProvider'
import { DBSetting } from './settings/DBSetting'
import { DBSettingProvider } from './settings/DBSettingProvider'
import { DBSkill } from './skills/DBSkill'
import { DBSkillMagical } from './skills/DBSkillMagical'
import { DBSkillPhysical } from './skills/DBSkillPhysical'
import { DBSkillProvider } from './skills/DBSkillProvider'
import config from '../../config/configuration'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DBAccount,
      DBCharacter,
      DBCharacterClasse,
      DBClasse,
      DBAuthenticationMethod,
      DBAuthenticationWithGoogle,
      DBAuthenticationWithPassword,
      DBRace,
      DBSetting,
      DBGuild,
      DBGuildMember,
      DBSkill,
      DBSkillPhysical,
      DBSkillMagical,
      DBGuildMember,
      DBItem,
      DBBattle,
      DBCharacterBattle
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
          DBAccount,
          DBCharacter,
          DBCharacterClasse,
          DBClasse,
          DBRace,
          DBAuthenticationMethod,
          DBAuthenticationWithGoogle,
          DBAuthenticationWithPassword,
          DBSetting,
          DBGuild,
          DBGuildMember,
          DBSkill,
          DBSkillMagical,
          DBSkillPhysical,
          DBSettingProvider,
          DBClasseSkill,
          DBGuildMember,
          DBItem,
          DBBattle,
          DBCharacterBattle
        ],
        migrations: [
          InitDb1698398468721,
          InitRaces1698933061831,
          AddSettings1698993525000,
          Skills1703068337272,
          AddItems1702544225000,
          Battle1703177293144
        ]
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    MigrationsProvider,
    {
      provide: 'IAccountProvider',
      useClass: DBAccountProvider
    },
    {
      provide: 'ICharacterProvider',
      useClass: DBCharacterProvider
    },
    {
      provide: 'IRaceProvider',
      useClass: DBRaceProvider
    },
    {
      provide: 'ISettingProvider',
      useClass: DBSettingProvider
    },
    {
      provide: 'IGuildProvider',
      useClass: DBGuildProvider
    },
    {
      provide: 'IClasseProvider',
      useClass: DBClasseProvider
    },
    {
      provide: 'ICharacterProvider',
      useClass: DBCharacterProvider
    },
    {
      provide: 'ICharacterClasseProvider',
      useClass: DBCharacterClasseProvider
    },
    {
      provide: 'IGuildMemberProvider',
      useClass: DBGuildMemberProvider
    },
    {
      provide: 'ISkillProvider',
      useClass: DBSkillProvider
    },
    {
      provide: 'IBattleProvider',
      useClass: DBBattleProvider
    },
    {
      provide: 'ICharacterBattleProvider',
      useClass: DBCharacterBattleProvider
    }
  ],
  exports: [
    TypeOrmModule,
    {
      provide: 'IAccountProvider',
      useClass: DBAccountProvider
    },
    {
      provide: 'ICharacterProvider',
      useClass: DBCharacterProvider
    },
    {
      provide: 'IRaceProvider',
      useClass: DBRaceProvider
    },
    {
      provide: 'ISettingProvider',
      useClass: DBSettingProvider
    },
    {
      provide: 'IGuildProvider',
      useClass: DBGuildProvider
    },
    {
      provide: 'IClasseProvider',
      useClass: DBClasseProvider
    },
    {
      provide: 'ICharacterProvider',
      useClass: DBCharacterProvider
    },
    {
      provide: 'ICharacterClasseProvider',
      useClass: DBCharacterClasseProvider
    },
    {
      provide: 'IGuildMemberProvider',
      useClass: DBGuildMemberProvider
    },
    {
      provide: 'ISkillProvider',
      useClass: DBSkillProvider
    },
    {
      provide: 'IBattleProvider',
      useClass: DBBattleProvider
    },
    {
      provide: 'ICharacterBattleProvider',
      useClass: DBCharacterBattleProvider
    }
  ]
})
export class PostgresModule {}
