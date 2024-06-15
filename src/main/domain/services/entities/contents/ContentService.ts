import { Content } from '../../../models/contents/Content'
import { ContentType } from '../../../models/contents/ContentType'
import { ICityProvider } from '../../../providers/cities/ICityProvider'
import { IContentProvider } from '../../../providers/contents/IContentProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name)
  constructor(
    @Inject('IContentProvider') private readonly contentProvider: IContentProvider,
    @Inject('ICityProvider') private readonly cityProvider: ICityProvider
  ) {
    this.logger.log('Initialised')
  }

  async getContent(type: ContentType): Promise<Content> {
    const city = await this.cityProvider.getCityById('ZVTn3BEAADg6id6s')
    return await this.contentProvider.getContent(type)
  }
}
