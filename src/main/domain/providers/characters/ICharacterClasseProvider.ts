import {
  CharacterClasse,
  CharacterClasseToCreate,
  CharacterClasseToUpdate
} from '../../models/characters/CharacterClasse'

export interface ICharacterClasseProvider {
  create(characterId: string, characterClasse: CharacterClasseToCreate): Promise<CharacterClasse>
  update(p: {
    characterId: string
    classeId: string
    characterClasse: CharacterClasseToUpdate
  }): Promise<CharacterClasse>
  deleteByCharacterIdAndClasseId(p: { characterId: string; classeId: string }): Promise<void>
}
