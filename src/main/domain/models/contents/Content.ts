import { ContentType } from './ContentType'

export abstract class Content {
  type: ContentType

  protected constructor(type: ContentType) {
    this.type = type
  }
}
