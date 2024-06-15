export class Item {
  id: string
  name: string
  used: boolean

  constructor(item: Item) {
    this.id = item.id
    this.name = item.name
    this.used = item.used
  }

  static toItemToCreate(p: { name: string }): ItemToCreate {
    return {
      name: p.name,
      used: false
    }
  }
}

export type ItemToCreate = Omit<Item, 'id'>
export type ItemToUpdate = Pick<Item, 'used'>
