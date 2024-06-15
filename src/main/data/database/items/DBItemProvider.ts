import { DBItem, DBItemToCreate, DBItemToUpdate } from './DBItem'
import { Item, ItemToCreate, ItemToUpdate } from '../../../domain/models/items/Item'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { IItemProvider } from '../../../domain/providers/items/IItemProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBItemProvider implements IItemProvider {
  private readonly logger = new Logger(DBItem.name)
  constructor(
    @InjectRepository(DBItem)
    private readonly itemRepository: Repository<DBItem>
  ) {
    this.logger.log('Initialised')
  }

  async create(p: { characterId: string; itemToCreate: ItemToCreate }): Promise<Item> {
    const toCreate: DBItemToCreate = {
      characterId: p.characterId,
      name: p.itemToCreate.name,
      used: p.itemToCreate.used,
      createdDate: new Date(),
      updatedDate: new Date()
    }
    const created = this.itemRepository.create(toCreate)
    await this.itemRepository.insert(created)
    return this.findOneById(created.id)
  }

  async findOneById(id: string): Promise<Item> {
    const dbItem = await this.itemRepository.findOne({
      where: {
        id: id
      },
      relations: DBItem.RELATIONS
    })
    if (!dbItem) {
      throw ProviderErrors.EntityNotFound(DBItemProvider.name)
    }
    return DBItem.toItem(dbItem)
  }

  async findAllPaginatedByCharacterId(p: { characterId: string; pageOptions: PageOptions }): Promise<Page<Item>> {
    const [res, total] = await this.itemRepository.findAndCount({
      where: {
        characterId: p.characterId
      },
      relations: DBItem.RELATIONS,
      take: p.pageOptions.perPage,
      skip: p.pageOptions.skip
    })
    return new Page({
      items: res.map((dbItem) => DBItem.toItem(dbItem)),
      pageOptions: p.pageOptions,
      total: total
    })
  }

  async update(p: { itemId: string; itemToUpdate: Partial<ItemToUpdate> }): Promise<Item> {
    const toUpdate: Partial<DBItemToUpdate> = {
      used: p.itemToUpdate.used,
      updatedDate: new Date()
    }
    await this.itemRepository.update(
      {
        id: p.itemId
      },
      toUpdate
    )
    return this.findOneById(p.itemId)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.itemRepository.delete({
      id: id
    })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBItem.name)
    }
  }
}
