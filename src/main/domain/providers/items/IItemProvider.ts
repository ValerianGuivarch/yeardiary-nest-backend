import { Item, ItemToCreate, ItemToUpdate } from '../../models/items/Item'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface IItemProvider {
  create(p: { characterId: string; itemToCreate: ItemToCreate }): Promise<Item>
  findOneById(itemId: string): Promise<Item>
  findAllPaginatedByCharacterId(p: { characterId: string; pageOptions: PageOptions }): Promise<Page<Item>>
  update(p: { itemId: string; itemToUpdate: Partial<ItemToUpdate> }): Promise<Item>
  deleteOneById(id: string): Promise<void>
}
