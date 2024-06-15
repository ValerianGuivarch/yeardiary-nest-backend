import { DomainErrors } from '../../../errors/DomainErrors'
import { Account } from '../../../models/accounts/Account'
import { Authority } from '../../../models/accounts/Authority'
import { Character, CharacterToCreate, CharacterToUpdate } from '../../../models/characters/Character'
import { CharacterClasse } from '../../../models/characters/CharacterClasse'
import { Skill } from '../../../models/skills/Skill'
import { SkillMagical } from '../../../models/skills/SkillMagical'
import { SkillPhysical } from '../../../models/skills/SkillPhysical'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { ICharacterClasseProvider } from '../../../providers/characters/ICharacterClasseProvider'
import { ICharacterProvider } from '../../../providers/characters/ICharacterProvider'
import { ICloudImageProvider } from '../../../providers/cloud_images/ICloudImageProvider'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CharacterService {
  constructor(
    @Inject('ICharacterProvider') private characterProvider: ICharacterProvider,
    @Inject('ICharacterClasseProvider') private characterClasseProvider: ICharacterClasseProvider,
    @Inject('ICloudImageProvider') private cloudImageProvider: ICloudImageProvider
  ) {}

  async createCharacter(characterToCreate: CharacterToCreate): Promise<Character> {
    return await this.characterProvider.create(characterToCreate)
  }

  async getCharacterById(id: string): Promise<Character> {
    return await this.characterProvider.findOneById(id)
  }

  async getAllCharactersPaginated(p: { account: Account; pageOptions: PageOptions }): Promise<Page<Character>> {
    if (p.account.authority === Authority.USER) {
      return await this.characterProvider.findAllByAccountIdPaginated({
        accountId: p.account.id,
        pageOptions: p.pageOptions
      })
    } else {
      return await this.characterProvider.findAllPaginated({
        pageOptions: p.pageOptions
      })
    }
  }

  async updateCharacter(p: { characterId: string; character: Partial<CharacterToUpdate> }): Promise<Character> {
    return await this.characterProvider.update({ characterId: p.characterId, character: p.character })
  }

  async deleteOneCharacter(characterId: string): Promise<void> {
    await this.characterProvider.deleteOneById(characterId)
  }

  async uploadCharacterPicture(characterId: string, file: Express.Multer.File): Promise<Character> {
    try {
      await this.characterProvider.findOneById(characterId)
    } catch (e) {
      throw DomainErrors.UploadCharacterPictureFailed(`Character ${characterId} not found`)
    }
    const filename = `character_picture_${characterId}`
    const imageUrl = await this.cloudImageProvider.uploadImage(file, filename)
    if (!imageUrl) {
      throw DomainErrors.UploadCharacterPictureFailed('Upload to cloud image failed')
    }
    return await this.characterProvider.update({ characterId: characterId, character: { picture: imageUrl } })
  }

  async createCharacterClasse(p: { level: number; characterId: string; classeId: string }): Promise<CharacterClasse> {
    const characterClasseToCreate = {
      level: p.level,
      classe: {
        id: p.classeId
      }
    }
    return await this.characterClasseProvider.create(p.characterId, characterClasseToCreate)
  }

  async updateCharacterClasse(p: { level: number; characterId: string; classeId: string }): Promise<CharacterClasse> {
    return await this.characterClasseProvider.update({
      characterId: p.characterId,
      classeId: p.classeId,
      characterClasse: {
        level: p.level
      }
    })
  }

  async deleteCharacterClasse(p: { characterId: string; classeId: string }): Promise<void> {
    await this.characterClasseProvider.deleteByCharacterIdAndClasseId({
      characterId: p.characterId,
      classeId: p.classeId
    })
  }

  async assignDamageToCharacter(p: { damage: number; skill: Skill; character: Character }): Promise<Character> {
    let modifiedDamage = p.damage
    if (p.character.race.name === 'Gnome' && SkillMagical.isSkillMagical(p.skill)) {
      // eslint-disable-next-line no-magic-numbers
      modifiedDamage = modifiedDamage / 2
    }
    if (p.character.race.name === 'Orc' && SkillPhysical.isSkillPhysical(p.skill)) {
      // eslint-disable-next-line no-magic-numbers
      modifiedDamage = modifiedDamage / 2
    }
    return await this.updateCharacter({
      characterId: p.character.id,
      character: { damageTaken: p.character.damageTaken + modifiedDamage }
    })
  }
}
