import { DBCharacterClasse } from '../../../main/data/database/character_classes/DBCharacterClasse'
import { DBCharacter } from '../../../main/data/database/characters/DBCharacter'
import { DBClasse } from '../../../main/data/database/classes/DBClasse'
import { Chance } from 'chance'

export class TestCharacterClasseHelpers {
  static chance = new Chance()

  static generateDBCharacterClasse(linkedEntities: { character: DBCharacter; classe: DBClasse }): DBCharacterClasse {
    return {
      character: linkedEntities.character,
      characterId: linkedEntities.character.id,
      createdDate: this.chance.date(),
      classe: linkedEntities.classe,
      classeId: linkedEntities.classe.id,
      level: this.chance.integer({ min: 1, max: 20 }),
      updatedDate: this.chance.date()
    }
  }
}
