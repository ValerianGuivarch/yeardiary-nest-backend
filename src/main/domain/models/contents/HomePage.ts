import { Content } from './Content'
import { ContentType } from './ContentType'

export class HomePage extends Content {
  title: string
  description: string
  pictureUrl: string
  pictureAlt: string

  constructor(homePage: { title: string; description: string; pictureUrl: string; pictureAlt: string }) {
    super(ContentType.HOME_PAGE)
    this.title = homePage.title
    this.description = homePage.description
    this.pictureUrl = homePage.pictureUrl
    this.pictureAlt = homePage.pictureAlt
  }
}
