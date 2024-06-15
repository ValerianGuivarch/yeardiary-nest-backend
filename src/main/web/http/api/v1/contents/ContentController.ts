import { CguVM, CguVMExample } from './entities/CguVM'
import { ContentVM } from './entities/ContentVM'
import { FactoryContentVM } from './entities/FactoryContentVM'
import { HomePageVM, HomePageVMExample } from './entities/HomePageVM'
import { ContentType } from '../../../../../domain/models/contents/ContentType'
import { ContentService } from '../../../../../domain/services/entities/contents/ContentService'
import { Public } from '../../decorators/PublicDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { generateResponseContent } from '../../utils/swagger'
import { Controller, Get, HttpCode, HttpStatus, Param, ParseEnumPipe, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Contents')
@UseGuards(RolesGuard)
@Public()
@Controller('api/v1/contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOkResponse({
    description: 'Get a content by id',
    content: generateResponseContent({
      types: [HomePageVM, CguVM],
      examples: {
        Homepage: HomePageVMExample,
        Cgu: CguVMExample
      }
    })
  })
  @ApiExtraModels(HomePageVM, CguVM)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':contentId')
  async getContentById(@Param('contentId', new ParseEnumPipe(ContentType)) contentId: ContentType): Promise<ContentVM> {
    return FactoryContentVM.from(await this.contentService.getContent(contentId))
  }
}
