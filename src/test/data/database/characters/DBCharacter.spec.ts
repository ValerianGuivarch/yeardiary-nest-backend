import { DBAccount } from '../../../../main/data/database/accounts/DBAccount'
import { DBCharacterClasse } from '../../../../main/data/database/character_classes/DBCharacterClasse'
import { DBCharacter } from '../../../../main/data/database/characters/DBCharacter'
import { DBCharacterProvider } from '../../../../main/data/database/characters/DBCharacterProvider'
import { DBClasse } from '../../../../main/data/database/classes/DBClasse'
import { DBClasseSkill } from '../../../../main/data/database/classes_skills/DBClasseSkill'
import { DBGuild } from '../../../../main/data/database/guilds/DBGuild'
import { DBGuildMember } from '../../../../main/data/database/guilds_members/DBGuildMember'
import { DBItem } from '../../../../main/data/database/items/DBItem'
import { DBDiary } from '../../../../main/data/database/diaries/DBDiary'
import { DBSkill } from '../../../../main/data/database/skills/DBSkill'
import { DBSkillMagical } from '../../../../main/data/database/skills/DBSkillMagical'
import { DBSkillPhysical } from '../../../../main/data/database/skills/DBSkillPhysical'
import { ProviderErrors } from '../../../../main/data/errors/ProviderErrors'
import { PageOptions } from '../../../../main/domain/models/utils/pages/PageOptions'
import { PageOrder } from '../../../../main/domain/models/utils/pages/PageOrder'
import { TestAccountHelpers } from '../../../helpers/entities/TestAccountHelpers'
import { TestCharacterClasseHelpers } from '../../../helpers/entities/TestCharacterClasseHelpers'
import { TestCharacterHelpers } from '../../../helpers/entities/TestCharacterHelpers'
import { TestClasseHelpers } from '../../../helpers/entities/TestClasseHelpers'
import { TestClasseSkillHelpers } from '../../../helpers/entities/TestClasseSkillHelpers'
import { TestGuildHelpers } from '../../../helpers/entities/TestGuildHelpers'
import { TestGuildMemberHelpers } from '../../../helpers/entities/TestGuildMemberHelpers'
import { TestRaceHelpers } from '../../../helpers/entities/TestRaceHelpers'
import { TestSkillHelpers } from '../../../helpers/entities/TestSkillHelpers'
import { getDataSourceAndContainer } from '../SetupDataSource'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { DataSource } from 'typeorm'

describe('DBCharacterProvider', () => {
  // eslint-disable-next-line no-magic-numbers
  jest.setTimeout(60000)
  let provider: DBCharacterProvider
  let datasource: DataSource
  let container: StartedPostgreSqlContainer
  beforeAll(async () => {
    const result = await getDataSourceAndContainer()
    datasource = result.datasource
    container = result.container
    const characterRepository = datasource.getRepository(DBCharacter)
    const raceRepository = datasource.getRepository(DBDiary)
    const accountRepository = datasource.getRepository(DBAccount)
    const characterClasseRepository = datasource.getRepository(DBCharacterClasse)
    const classeRepository = datasource.getRepository(DBClasse)
    const guildRepository = datasource.getRepository(DBGuild)
    const guildMemberRepository = datasource.getRepository(DBGuildMember)
    const skillMagicalRepository = datasource.getRepository(DBSkillMagical)
    const skillPhysicalRepository = datasource.getRepository(DBSkillPhysical)
    const skillRepository = datasource.getRepository(DBSkill)
    const classeSkillRepository = datasource.getRepository(DBClasseSkill)
    const itemRepository = datasource.getRepository(DBAccount)
    const moduleRef = await Test.createTestingModule({
      providers: [
        DBCharacterProvider,
        { provide: getRepositoryToken(DBCharacter), useValue: characterRepository },
        { provide: getRepositoryToken(DBDiary), useValue: raceRepository },
        { provide: getRepositoryToken(DBCharacterClasse), useValue: characterClasseRepository },
        { provide: getRepositoryToken(DBClasse), useValue: classeRepository },
        { provide: getRepositoryToken(DBGuild), useValue: guildRepository },
        { provide: getRepositoryToken(DBGuildMember), useValue: guildMemberRepository },
        { provide: getRepositoryToken(DBAccount), useValue: accountRepository },
        { provide: getRepositoryToken(DBSkillMagical), useValue: skillMagicalRepository },
        { provide: getRepositoryToken(DBSkillPhysical), useValue: skillPhysicalRepository },
        { provide: getRepositoryToken(DBSkill), useValue: skillRepository },
        { provide: getRepositoryToken(DBClasseSkill), useValue: classeSkillRepository },
        { provide: getRepositoryToken(DBItem), useValue: itemRepository }
      ]
    }).compile()
    provider = moduleRef.get(DBCharacterProvider)
  })
  afterEach(async () => {
    await datasource.getRepository(DBCharacterClasse).delete({})
    await datasource.getRepository(DBClasseSkill).delete({})
    await datasource.getRepository(DBSkill).delete({})
    await datasource.getRepository(DBGuildMember).delete({})
    await datasource.getRepository(DBClasse).delete({})
    await datasource.getRepository(DBGuild).delete({})
    await datasource.getRepository(DBCharacter).delete({})
    await datasource.getRepository(DBDiary).delete({})
    await datasource.getRepository(DBAccount).delete({})
    await datasource.getRepository(DBItem).delete({})
  })
  afterAll(async () => {
    await datasource?.destroy()
    await container?.stop()
  })

  it('can create an instance of DBCharacterProvider', () => {
    expect(provider).toBeInstanceOf(DBCharacterProvider)
  })

  describe('create', () => {
    it('should return an inserted character when its account and race does exist', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character = {
        ...TestCharacterHelpers.generateCharacterToCreate(),
        linkedAccount: {
          id: account.id
        },
        race: { id: race.id }
      }

      // WHEN
      const res = await provider.create(character)

      // THEN
      expect(res).toBeDefined()
      expect(res.race).toBeDefined()
      expect(res.race.id).toEqual(race.id)
      expect(res.linkedAccount.id).toEqual(account.id)
    })
    it('should not create if there is no related account and throw error', async () => {
      // GIVEN
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character = { ...TestCharacterHelpers.generateCharacterToCreate(), raceId: race.id }

      // WHEN - THEN
      await expect(provider.create(character)).rejects.toThrowError()
    })
    it('should not create if there is no related race and throw error', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const character = { ...TestCharacterHelpers.generateCharacterToCreate(), accountId: account.id }

      // WHEN - THEN
      await expect(provider.create(character)).rejects.toThrowError()
    })
  })
  describe('findOneById', () => {
    it('should return the character with matching id with relations account and race', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(character)

      // WHEN
      const res = await provider.findOneById(character.id)

      // THEN
      expect(res.id).toEqual(character.id)
      expect(res.race).toBeDefined()
      expect(res.race.id).toEqual(race.id)
      expect(res.linkedAccount.id).toEqual(account.id)
    })
    it('should return the character with matching id with relations account, race and the invoker id when set', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const invoker = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(invoker)
      const character = {
        ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }),
        invokerId: invoker.id
      }
      await datasource.getRepository(DBCharacter).save(character)

      // WHEN
      const res = await provider.findOneById(character.id)

      // THEN
      expect(res.id).toEqual(character.id)
      expect(res.race).toBeDefined()
      expect(res.race.id).toEqual(race.id)
      expect(res.linkedAccount.id).toEqual(account.id)
      expect(res.linkedInvoker?.id).toEqual(invoker.id)
    })
    it('should return the character with matching id with relations account, race, all classe levels with skills', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const classe1 = TestClasseHelpers.generateDBClasse()
      const classe2 = TestClasseHelpers.generateDBClasse()
      await datasource.getRepository(DBClasse).save([classe1, classe2])
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(character)
      const characterClasse1 = TestCharacterClasseHelpers.generateDBCharacterClasse({
        character: character,
        classe: classe1
      })
      const characterClasse2 = TestCharacterClasseHelpers.generateDBCharacterClasse({
        character: character,
        classe: classe2
      })
      await datasource.getRepository(DBCharacterClasse).save([characterClasse1, characterClasse2])
      const skillMagical = TestSkillHelpers.generateDBSkillMagical()
      const skillPhysical = TestSkillHelpers.generateDBSkillPhysical()
      await datasource.getRepository(DBSkillMagical).save(skillMagical)
      await datasource.getRepository(DBSkillPhysical).save(skillPhysical)
      const classeSkill1 = TestClasseSkillHelpers.generateDBClasseSkill({ classe: classe1, skill: skillMagical })
      const classeSkill2 = TestClasseSkillHelpers.generateDBClasseSkill({ classe: classe2, skill: skillPhysical })
      await datasource.getRepository(DBClasseSkill).save([classeSkill1, classeSkill2])

      // WHEN
      const res = await provider.findOneById(character.id)

      // THEN
      expect(res.id).toEqual(character.id)
      expect(res.race).toBeDefined()
      expect(res.race.id).toEqual(race.id)
      expect(res.linkedAccount.id).toEqual(account.id)
      // eslint-disable-next-line no-magic-numbers
      expect(res.classes.length).toEqual(2)
    })
    it('should return the character with matching id with relations account, race, all guilds', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const guild1 = TestGuildHelpers.generateDBGuild()
      const guild2 = TestGuildHelpers.generateDBGuild()
      await datasource.getRepository(DBGuild).save([guild1, guild2])
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(character)
      const guildMember1 = TestGuildMemberHelpers.generateDBGuildMember({ character: character, guild: guild1 })
      const guildMember2 = TestGuildMemberHelpers.generateDBGuildMember({ character: character, guild: guild2 })
      await datasource.getRepository(DBGuildMember).save([guildMember1, guildMember2])

      // WHEN
      const res = await provider.findOneById(character.id)

      // THEN
      expect(res.id).toEqual(character.id)
      expect(res.race).toBeDefined()
      expect(res.race.id).toEqual(race.id)
      expect(res.linkedAccount.id).toEqual(account.id)
      // eslint-disable-next-line no-magic-numbers
      expect(res.guilds.length).toEqual(2)
    })
    it('should throw entity not found if there is no character with matching id', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })

      // WHEN - THEN
      await expect(provider.findOneById(character.id)).rejects.toThrowError(
        ProviderErrors.EntityNotFound(DBCharacter.name)
      )
    })
  })
  describe('findAllPaginated', () => {
    const pageOptions = new PageOptions({
      page: 1,
      perPage: 2,
      order: PageOrder.ASC
    })
    it('should return the characters in page with required number of elements, ordered by name and the total number', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character1 = { ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }), name: 'A' }
      const character2 = { ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }), name: 'B' }
      const character3 = { ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }), name: 'C' }
      await datasource.getRepository(DBCharacter).save([character1, character2, character3])

      // WHEN
      const res = await provider.findAllPaginated({ pageOptions: pageOptions })

      // THEN
      expect(res.items.length).toEqual(pageOptions.perPage)
      expect(res.items).toContainEqual(await provider.findOneById(character1.id))
      expect(res.items).toContainEqual(await provider.findOneById(character2.id))
      expect(res.items).not.toContainEqual(await provider.findOneById(character3.id))
      // eslint-disable-next-line no-magic-numbers
      expect(res.pageData.total).toEqual(3)
    })
  })
  describe('findAllByAccountIdPaginated', () => {
    const pageOptions = new PageOptions({
      page: 1,
      perPage: 2,
      order: PageOrder.ASC
    })
    const pageOptions2 = new PageOptions({
      page: 2,
      perPage: 2,
      order: PageOrder.ASC
    })
    it('should return the characters in page with required number of elements with matching account Id, ordered by name and the total number', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      const account2 = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save([account, account2])
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character1 = { ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }), name: 'A' }
      const character2 = { ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }), name: 'B' }
      const character3 = { ...TestCharacterHelpers.generateDBCharacter({ account: account, race: race }), name: 'C' }
      const character4 = { ...TestCharacterHelpers.generateDBCharacter({ account: account2, race: race }), name: 'D' }
      await datasource.getRepository(DBCharacter).save([character1, character2, character3, character4])

      // WHEN
      const resPage1 = await provider.findAllByAccountIdPaginated({ accountId: account.id, pageOptions: pageOptions })
      const resPage2 = await provider.findAllByAccountIdPaginated({ accountId: account.id, pageOptions: pageOptions2 })

      // THEN
      expect(resPage1.items.length).toEqual(pageOptions.perPage)
      expect(resPage1.items).toContainEqual(await provider.findOneById(character1.id))
      expect(resPage1.items).toContainEqual(await provider.findOneById(character2.id))
      expect(resPage1.items).not.toContainEqual(await provider.findOneById(character3.id))
      expect(resPage1.items).not.toContainEqual(await provider.findOneById(character4.id))
      // eslint-disable-next-line no-magic-numbers
      expect(resPage1.pageData.total).toEqual(3)
      expect(resPage2.items).toContainEqual(await provider.findOneById(character3.id))
      expect(resPage2.items).not.toContainEqual(await provider.findOneById(character1.id))
      expect(resPage2.items).not.toContainEqual(await provider.findOneById(character2.id))
      expect(resPage2.items).not.toContainEqual(await provider.findOneById(character4.id))
    })
  })
  describe('deleteByIds', () => {
    it('should delete entities with matching ids', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character1 = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      const character2 = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      const character3 = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save([character1, character2, character3])

      // WHEN
      await provider.deleteOneById(character1.id)

      // THEN
      expect(await datasource.getRepository(DBCharacter).findOneBy({ id: character1.id })).toBeNull()
      expect(await datasource.getRepository(DBCharacter).findOneBy({ id: character2.id })).toBeDefined()
      expect(await datasource.getRepository(DBCharacter).findOneBy({ id: character3.id })).toBeDefined()
    })
  })
  describe('update', () => {
    it('should return the updated character', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      const race2 = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save([race, race2])
      const invoker = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save([character, invoker])
      const characterToUpdate = TestCharacterHelpers.generateCharacterToUpdate()

      // WHEN
      const res = await provider.update({ characterId: character.id, character: characterToUpdate })

      // THEN
      expect(res.id).toEqual(character.id)
      expect(res.race.id).toEqual(race.id)
      expect(res.picture).toEqual(characterToUpdate.picture)
      expect(res.level).toEqual(characterToUpdate.level)
      expect(res.name).toEqual(characterToUpdate.name)
    })
    it('should throw entity not found if there is no character with matching id', async () => {
      // GIVEN
      const account = TestAccountHelpers.generateDBAccount()
      await datasource.getRepository(DBAccount).save(account)
      const race = TestRaceHelpers.generateDBRace()
      await datasource.getRepository(DBDiary).save(race)
      const character = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      const character2 = TestCharacterHelpers.generateDBCharacter({ account: account, race: race })
      await datasource.getRepository(DBCharacter).save(character)
      const characterToUpdate = TestCharacterHelpers.generateCharacterToUpdate()

      // WHEN - THEN
      await expect(provider.update({ characterId: character2.id, character: characterToUpdate })).rejects.toThrowError()
    })
  })
})
