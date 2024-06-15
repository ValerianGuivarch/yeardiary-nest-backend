import { PrismicCguRaw } from './PrismicCguRaw'
import { PrismicHomePageRaw } from './PrismicHomePageRaw'
import { Cgu } from '../../../domain/models/contents/Cgu'
import { Content } from '../../../domain/models/contents/Content'
import { ContentType } from '../../../domain/models/contents/ContentType'
import { HomePage } from '../../../domain/models/contents/HomePage'
import { IContentProvider } from '../../../domain/providers/contents/IContentProvider'
import { PrismicProvider } from '../PrismicProvider'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismicContentProvider implements IContentProvider {
  constructor(private readonly prismicProvider: PrismicProvider) {}

  async getContent(type: ContentType): Promise<Content> {
    if (type === ContentType.HOME_PAGE) {
      const rawData = await this.prismicProvider.getSinglePage<typeof PrismicHomePageRaw>('homepage')
      const data = PrismicHomePageRaw.parse(rawData)

      return new HomePage({
        title: data.title.text,
        description: data.description.text,
        pictureUrl: data.picture.url,
        pictureAlt: data.picture.alt
      })
    } else if (type === ContentType.CGU) {
      const rawData = await this.prismicProvider.getSinglePage<typeof PrismicCguRaw>('cgu')
      const data = PrismicCguRaw.parse(rawData)

      return new Cgu({
        text: data.text
      })
    } else {
      throw new Error('Unknown content type')
    }
  }
}
