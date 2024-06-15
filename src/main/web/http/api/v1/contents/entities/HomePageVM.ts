import { ContentVM } from './ContentVM'
import { Content } from '../../../../../../domain/models/contents/Content'
import { ContentType } from '../../../../../../domain/models/contents/ContentType'
import { HomePage } from '../../../../../../domain/models/contents/HomePage'
import { ApiProperty } from '@nestjs/swagger'

export class HomePageVM extends ContentVM {
  @ApiProperty({
    description: 'The home page title',
    type: String
  })
  title: string

  @ApiProperty({
    description: 'The home page description',
    type: String
  })
  description: string

  @ApiProperty({
    description: 'The home page picture url',
    type: String
  })
  pictureUrl: string

  @ApiProperty({
    description: 'The home page picture alt',
    type: String
  })
  pictureAlt: string

  constructor(homePage: HomePageVM) {
    super(homePage)
    this.title = homePage.title
    this.description = homePage.description
    this.pictureUrl = homePage.pictureUrl
    this.pictureAlt = homePage.pictureAlt
  }

  static from(homePage: HomePage): HomePageVM {
    return new HomePageVM({
      type: homePage.type,
      title: homePage.title,
      description: homePage.description,
      pictureUrl: homePage.pictureUrl,
      pictureAlt: homePage.pictureAlt
    })
  }

  static isHomePage(content: Content): content is HomePage {
    return content.type === ContentType.HOME_PAGE
  }
}

export const HomePageVMExample: HomePageVM = {
  type: ContentType.HOME_PAGE,
  title: 'My home page',
  description: 'My home page description',
  pictureUrl: 'https://my-picture-url.com',
  pictureAlt: 'My picture alt'
}
