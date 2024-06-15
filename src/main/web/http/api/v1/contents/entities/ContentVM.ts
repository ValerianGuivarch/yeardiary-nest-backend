import { Content } from '../../../../../../domain/models/contents/Content'
import { ContentType } from '../../../../../../domain/models/contents/ContentType'
import { ApiProperty } from '@nestjs/swagger'

export abstract class ContentVM {
  @ApiProperty({ description: 'The content typpe', enumName: 'ContentType', enum: ContentType })
  type: ContentType

  protected constructor(content: Content) {
    this.type = content.type
  }
}
