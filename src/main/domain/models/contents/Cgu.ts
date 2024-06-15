import { Content } from './Content'
import { ContentType } from './ContentType'

export class Cgu extends Content {
  text: string

  constructor(cgu: { text: string }) {
    super(ContentType.CGU)
    this.text = cgu.text
  }
}
