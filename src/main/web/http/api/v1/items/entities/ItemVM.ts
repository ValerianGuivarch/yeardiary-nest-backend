import { Item } from '../../../../../../domain/models/items/Item'
import { ApiProperty } from '@nestjs/swagger'

export class ItemVM {
  @ApiProperty({ description: 'The item id', type: String, format: 'uuid' })
  id: string

  @ApiProperty({ description: 'The item name', type: String })
  name: string

  @ApiProperty({ description: 'The used state of this item', type: Boolean })
  used: boolean

  constructor(item: ItemVM) {
    this.id = item.id
    this.name = item.name
    this.used = item.used
  }

  static from(item: Item): ItemVM {
    return new ItemVM({
      id: item.id,
      name: item.name,
      used: item.used
    })
  }
}

export const ItemVMExample: ItemVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  name: 'Sword',
  used: false
}
