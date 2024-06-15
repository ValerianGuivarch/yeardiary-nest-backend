import { Character, CharacterToCreate, CharacterToUpdate } from '../../models/characters/Character'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface ICharacterProvider {
  create(character: CharacterToCreate): Promise<Character>
  findOneById(id: string): Promise<Character>
  findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Character>>
  findAllByAccountIdPaginated(p: { accountId: string; pageOptions: PageOptions }): Promise<Page<Character>>
  update(p: { characterId: string; character: Partial<CharacterToUpdate> }): Promise<Character>
  deleteOneById(id: string): Promise<void>
}
