import { CharacterToCreate } from '../../../../main/domain/models/characters/Character'
import { ICharacterClasseProvider } from '../../../../main/domain/providers/characters/ICharacterClasseProvider'
import { ICharacterProvider } from '../../../../main/domain/providers/characters/ICharacterProvider'
import { ICloudImageProvider } from '../../../../main/domain/providers/cloud_images/ICloudImageProvider'
import { CharacterService } from '../../../../main/domain/services/entities/characters/CharacterService'
import { TestCharacterHelpers } from '../../../helpers/entities/TestCharacterHelpers'
import { createMock } from '@golevelup/ts-jest'
import { Test } from '@nestjs/testing'

describe('CharacterService', () => {
  let characterService: CharacterService
  let mockedCharacterProvider: ICharacterProvider
  let mockedCharacterClasseProvider: ICharacterClasseProvider
  let mockedCloudImageProvider: ICloudImageProvider

  beforeEach(async () => {
    mockedCharacterProvider = createMock<ICharacterProvider>()

    const moduleRef = await Test.createTestingModule({
      providers: [
        CharacterService,
        { provide: 'ICharacterProvider', useValue: mockedCharacterProvider },
        { provide: 'ICloudImageProvider', useValue: mockedCloudImageProvider },
        { provide: 'ICharacterClasseProvider', useValue: mockedCharacterClasseProvider }
      ]
    }).compile()
    characterService = moduleRef.get(CharacterService)
  })

  describe('createCharacter', () => {
    it('should return a new character when is effectively created', async () => {
      const characterToCreate = TestCharacterHelpers.generateCharacterToCreate()
      const expectedCharacter = TestCharacterHelpers.generateCharacter()
      mockedCharacterProvider.create = jest.fn().mockResolvedValue(expectedCharacter)

      const result = await characterService.createCharacter(characterToCreate)

      expect(result).toStrictEqual(expectedCharacter)
      expect(mockedCharacterProvider.create).toHaveBeenCalledWith(<CharacterToCreate>characterToCreate)
    })
  })
})
