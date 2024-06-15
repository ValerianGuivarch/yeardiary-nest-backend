import { getDataSourceAndContainer } from './SetupDataSource'
import { DBAccount } from '../../../main/data/database/accounts/DBAccount'
import { DBAuthenticationWithGoogle } from '../../../main/data/database/accounts/DBAuthenticationWithGoogle'
import { DBAuthenticationWithPassword } from '../../../main/data/database/accounts/DBAuthenticationWithPassword'
import { DBCharacterClasse } from '../../../main/data/database/character_classes/DBCharacterClasse'
import { DBCharacter } from '../../../main/data/database/characters/DBCharacter'
import { DBClasse } from '../../../main/data/database/classes/DBClasse'
import { DBGuild } from '../../../main/data/database/guilds/DBGuild'
import { DBGuildMember } from '../../../main/data/database/guilds_members/DBGuildMember'
import { DBRace } from '../../../main/data/database/races/DBRace'
import { TestAccountHelpers } from '../../helpers/entities/TestAccountHelpers'
import { TestAuthenticationHelpers } from '../../helpers/entities/TestAuthenticationHelpers'
import { TestCharacterClasseHelpers } from '../../helpers/entities/TestCharacterClasseHelpers'
import { TestCharacterHelpers } from '../../helpers/entities/TestCharacterHelpers'
import { TestClasseHelpers } from '../../helpers/entities/TestClasseHelpers'
import { TestGuildHelpers } from '../../helpers/entities/TestGuildHelpers'
import { TestGuildMemberHelpers } from '../../helpers/entities/TestGuildMemberHelpers'
import { TestRaceHelpers } from '../../helpers/entities/TestRaceHelpers'
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { DataSource } from 'typeorm'

// Tests to verify that the migrations are keeping the database in a consistent state
describe('Migrations', () => {
  jest.setTimeout(60000)
  let datasource: DataSource
  let container: StartedPostgreSqlContainer
  beforeAll(async () => {
    const result = await getDataSourceAndContainer()
    datasource = result.datasource
    container = result.container
  })
  afterAll(async () => {
    await datasource?.destroy()
    await container?.stop()
  })
  describe('DBAccount', () => {
    it('should be able to create example object', async () => {
      const account = TestAccountHelpers.generateDBAccount()

      await datasource.getRepository(DBAccount).save(account)
      const insertedAccount = await datasource.getRepository(DBAccount).findOneBy({ id: account.id })

      expect(insertedAccount).toEqual(account)
    })
  })
  describe('DBAuthenticationMethodWithPassword', () => {
    it('should be able to create example object', async () => {
      // Linked Entities
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)

      const authentication = TestAuthenticationHelpers.generateDBAuthenticationWithPassword({ account: account })

      await datasource.getRepository(DBAuthenticationWithPassword).save(authentication)
      const insertedAuthentication = await datasource
        .getRepository(DBAuthenticationWithPassword)
        .findOneBy({ id: authentication.id })

      expect(insertedAuthentication).toEqual(authentication)
    })
  })
  describe('DBAuthenticationMethodWithGoogle', () => {
    it('should be able to create example object', async () => {
      // Linked Entities
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)

      const authentication = TestAuthenticationHelpers.generateDBAuthenticationWithGoogle({ account: account })

      await datasource.getRepository(DBAuthenticationWithGoogle).save(authentication)
      const insertedAuthentication = await datasource
        .getRepository(DBAuthenticationWithGoogle)
        .findOneBy({ id: authentication.id })

      expect(insertedAuthentication).toEqual(authentication)
    })
  })
  describe('DBRace', () => {
    it('should be able to create example object', async () => {
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBRace).save(race)
      const insertedRace = await datasource.getRepository(DBRace).findOneBy({ id: race.id })

      expect(insertedRace).toEqual(race)
    })
  })
  describe('DBGuild', () => {
    it('should be able to create example object', async () => {
      const guild = TestGuildHelpers.generateDBGuild()
      await datasource.getRepository(DBGuild).save(guild)
      const insertedGuild = await datasource.getRepository(DBGuild).findOneBy({ id: guild.id })

      expect(insertedGuild).toBeDefined()
    })
  })
  describe('DBClasse', () => {
    it('should be able to create example object', async () => {
      const classe = TestClasseHelpers.generateDBClasse()
      await datasource.getRepository(DBClasse).save(classe)
      const insertedClasse = await datasource.getRepository(DBClasse).findOneBy({ id: classe.id })

      expect(insertedClasse).toBeDefined()
    })
  })
  describe('DBCharacter', () => {
    it('should be able to create example object', async () => {
      // Linked Entities
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBRace).save(race)

      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })

      await datasource.getRepository(DBCharacter).save(character)
      const insertedCharacter = await datasource.getRepository(DBCharacter).findOneBy({ id: character.id })

      expect(insertedCharacter).toBeDefined()
    })
  })
  describe('DBGuildMember', () => {
    it('should be able to create example object', async () => {
      // Linked Entities
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBRace).save(race)
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(character)
      const guild = TestGuildHelpers.generateDBGuild()
      await datasource.getRepository(DBGuild).save(guild)

      const guildMember = TestGuildMemberHelpers.generateDBGuildMember({ character: character, guild: guild })
      await datasource.getRepository(DBGuildMember).save(guildMember)
      const insertedGuildMember = await datasource
        .getRepository(DBGuildMember)
        .findOneBy({ characterId: character.id, guildId: guild.id })

      expect(insertedGuildMember).toBeDefined()
    })
  })
  describe('DBCharacterClasse', () => {
    it('should be able to create example object', async () => {
      // Linked Entities
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBRace).save(race)
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(character)
      const classe = TestClasseHelpers.generateDBClasse()
      await datasource.getRepository(DBClasse).save(classe)

      const characterClasse = TestCharacterClasseHelpers.generateDBCharacterClasse({
        character: character,
        classe: classe
      })
      await datasource.getRepository(DBCharacterClasse).save(characterClasse)
      const insertedCharacterClasse = await datasource
        .getRepository(DBCharacterClasse)
        .findOneBy({ characterId: character.id, classeId: classe.id })

      expect(insertedCharacterClasse).toBeDefined()
    })
  })
})
