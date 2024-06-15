import { DBAccount } from '../../../main/data/database/accounts/DBAccount'
import { DBAuthenticationMethod } from '../../../main/data/database/accounts/DBAuthenticationMethod'
import { DBAuthenticationWithGoogle } from '../../../main/data/database/accounts/DBAuthenticationWithGoogle'
import { DBAuthenticationWithPassword } from '../../../main/data/database/accounts/DBAuthenticationWithPassword'
import { DBCharacterClasse } from '../../../main/data/database/character_classes/DBCharacterClasse'
import { DBCharacter } from '../../../main/data/database/characters/DBCharacter'
import { DBClasse } from '../../../main/data/database/classes/DBClasse'
import { DBClasseSkill } from '../../../main/data/database/classes_skills/DBClasseSkill'
import { DBGuild } from '../../../main/data/database/guilds/DBGuild'
import { DBGuildMember } from '../../../main/data/database/guilds_members/DBGuildMember'
import { DBItem } from '../../../main/data/database/items/DBItem'
import { InitDb1698398468721 } from '../../../main/data/database/migrations/1698398468721-init-db'
import { InitRaces1698933061831 } from '../../../main/data/database/migrations/1698933061831-init-races'
import { AddSettings1698993525000 } from '../../../main/data/database/migrations/1698993525000-add-settings'
import { AddItems1702544225000 } from '../../../main/data/database/migrations/1702544225000-add-items'
import { Skills1703068337272 } from '../../../main/data/database/migrations/1703068337272-skills'
import { Battle1703177293144 } from '../../../main/data/database/migrations/1703177293144-battle'
import { DBRace } from '../../../main/data/database/races/DBRace'
import { DBSetting } from '../../../main/data/database/settings/DBSetting'
import { DBSettingProvider } from '../../../main/data/database/settings/DBSettingProvider'
import { DBSkill } from '../../../main/data/database/skills/DBSkill'
import { DBSkillMagical } from '../../../main/data/database/skills/DBSkillMagical'
import { DBSkillPhysical } from '../../../main/data/database/skills/DBSkillPhysical'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { DataSource } from 'typeorm'

export const getDataSourceAndContainer = async (): Promise<{
  datasource: DataSource
  container: StartedPostgreSqlContainer
}> => {
  const container: StartedPostgreSqlContainer = await new PostgreSqlContainer().start()
  const datasource: DataSource = new DataSource({
    type: 'postgres',
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
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
      DBItem
    ],
    migrations: [
      InitDb1698398468721,
      InitRaces1698933061831,
      AddSettings1698993525000,
      Skills1703068337272,
      AddItems1702544225000,
      Battle1703177293144
    ]
  })
  await datasource.initialize()
  await datasource.runMigrations()

  return { datasource, container }
}

export const clearDataSourceAndContainer = async (p: {
  datasource: DataSource
  container: StartedPostgreSqlContainer
}): Promise<void> => {
  await p.datasource?.destroy()
  await p.container?.stop()
}
