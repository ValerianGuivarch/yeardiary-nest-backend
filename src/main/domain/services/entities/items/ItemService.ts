import { Item, ItemToCreate, ItemToUpdate } from '../../../models/items/Item'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { IItemProvider } from '../../../providers/items/IItemProvider'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class ItemService {
  constructor(@Inject('IItemProvider') private itemProvider: IItemProvider) {}

  async createItem(p: { characterId: string; itemToCreate: ItemToCreate }): Promise<Item> {
    return await this.itemProvider.create({
      characterId: p.characterId,
      itemToCreate: p.itemToCreate
    })
  }

  async getItemById(itemId: string): Promise<Item> {
    return await this.itemProvider.findOneById(itemId)
  }

  async getAllPaginatedByCharacterId(p: { characterId: string; pageOptions: PageOptions }): Promise<Page<Item>> {
    return await this.itemProvider.findAllPaginatedByCharacterId({
      characterId: p.characterId,
      pageOptions: p.pageOptions
    })
  }

  async updateItem(p: { itemId: string; itemToUpdate: Partial<ItemToUpdate> }): Promise<Item> {
    return await this.itemProvider.update({
      itemId: p.itemId,
      itemToUpdate: p.itemToUpdate
    })
  }

  async deleteOneItem(id: string): Promise<void> {
    await this.itemProvider.deleteOneById(id)
  }
}
