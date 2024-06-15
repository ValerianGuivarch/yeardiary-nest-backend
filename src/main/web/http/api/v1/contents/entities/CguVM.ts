import { ContentVM } from './ContentVM'
import { Cgu } from '../../../../../../domain/models/contents/Cgu'
import { Content } from '../../../../../../domain/models/contents/Content'
import { ContentType } from '../../../../../../domain/models/contents/ContentType'
import { ApiProperty } from '@nestjs/swagger'

export class CguVM extends ContentVM {
  @ApiProperty({
    description: 'The cgu text',
    type: String
  })
  text: string

  constructor(cgu: CguVM) {
    super(cgu)
    this.text = cgu.text
  }

  static from(cgu: Cgu): CguVM {
    return new CguVM({
      type: cgu.type,
      text: cgu.text
    })
  }

  static isCgu(content: Content): content is Cgu {
    return content.type === ContentType.CGU
  }
}

export const CguVMExample: CguVM = {
  type: ContentType.CGU,
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl'
}
