import { CguVM } from './CguVM'
import { ContentVM } from './ContentVM'
import { HomePageVM } from './HomePageVM'
import { Content } from '../../../../../../domain/models/contents/Content'
import { HttpException, HttpStatus } from '@nestjs/common'

export class FactoryContentVM {
  static from(content: Content): ContentVM {
    if (HomePageVM.isHomePage(content)) {
      return HomePageVM.from(content)
    } else if (CguVM.isCgu(content)) {
      return CguVM.from(content)
    } else {
      throw new HttpException('Wrong content type', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
