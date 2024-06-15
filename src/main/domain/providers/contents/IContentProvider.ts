import { Content } from '../../models/contents/Content'
import { ContentType } from '../../models/contents/ContentType'

export interface IContentProvider {
  getContent(type: ContentType): Promise<Content>
}
