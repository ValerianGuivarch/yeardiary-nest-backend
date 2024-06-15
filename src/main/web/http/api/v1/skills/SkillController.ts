import { FactorySkillVM } from './entities/FactorySkillVM'
import { SkillMagicalVM, SkillMagicalVMExample } from './entities/SkillMagicalVM'
import { SkillPhysicalVM, SkillPhysicalVMExample } from './entities/SkillPhysicallVM'
import { SkillVM } from './entities/SkillVM'
import {
  CreateSkillMagicalRequest,
  CreateSkillMagicalRequestExample
} from './requests/create/CreateSkillMagicalRequest'
import {
  CreateSkillPhysicalRequest,
  CreateSkillPhysicalRequestExample
} from './requests/create/CreateSkillPhysicalRequest'
import { CreateSkillRequest } from './requests/create/CreateSkillRequest'
import {
  UpdateSkillMagicalRequest,
  UpdateSkillMagicalRequestExample
} from './requests/update/UpdateSkillMagicalRequest'
import {
  UpdateSkillPhysicalRequest,
  UpdateSkillPhysicalRequestExample
} from './requests/update/UpdateSkillPhysicalRequest'
import { UpdateSkillRequest } from './requests/update/UpdateSkillRequest'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Skill } from '../../../../../domain/models/skills/Skill'
import { SkillMagical } from '../../../../../domain/models/skills/SkillMagical'
import { SkillPhysical } from '../../../../../domain/models/skills/SkillPhysical'
import { SkillService } from '../../../../../domain/services/entities/skills/SkillService'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
import { PageVM } from '../../utils/paginations/PageVM'
import {
  generatePageResponseContent,
  generateRequestSchemasAndExamples,
  generateResponseContent
} from '../../utils/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'

@ApiTags('Skills')
@ApiBearerAuth()
@ApiExtraModels(CreateSkillMagicalRequest, CreateSkillPhysicalRequest)
@UseGuards(RolesGuard)
@Roles(Authority.ADMIN)
@Controller('api/v1/skills')
export class SkillController {
  private readonly logger = new Logger(SkillController.name)

  constructor(private readonly skillService: SkillService) {}

  @ApiCreatedResponse({
    description: 'Create a new skill',
    content: generateResponseContent({
      types: [SkillPhysicalVM, SkillMagicalVM],
      examples: {
        'Magical example': SkillMagicalVMExample,
        'Physical example': SkillPhysicalVMExample
      }
    })
  })
  @ApiExtraModels(SkillPhysicalVM, SkillMagicalVM)
  @ApiBody({
    description: 'Create Skill Request',
    required: true,
    ...generateRequestSchemasAndExamples<CreateSkillRequest>({
      types: [CreateSkillMagicalRequest, CreateSkillPhysicalRequest],
      examples: {
        magical: CreateSkillMagicalRequestExample,
        physical: CreateSkillPhysicalRequestExample
      }
    })
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createSkill(@Body() request: CreateSkillRequest): Promise<SkillVM> {
    let skill: Skill
    if (CreateSkillRequest.isMagicalSkillRequest(request)) {
      skill = await this.skillService.createSkillMagical(
        SkillMagical.toSkillMagicalToCreate({
          name: request.name,
          description: request.description,
          damage: request.damage,
          minimumLevel: request.minimumLevel,
          element: request.element,
          spellLevel: request.spellLevel
        })
      )
    } else if (CreateSkillRequest.isPhysicalSkillRequest(request)) {
      skill = await this.skillService.createSkillPhysical(
        SkillPhysical.toSkillPhysicalToCreate({
          name: request.name,
          description: request.description,
          damage: request.damage,
          minimumLevel: request.minimumLevel,
          weaponType: request.weaponType
        })
      )
    } else {
      throw new HttpException('Wrong skill type', HttpStatus.BAD_REQUEST)
    }
    return FactorySkillVM.from(skill)
  }

  @ApiOkResponse({
    description: 'Get all skills',
    content: generatePageResponseContent<SkillVM>({
      types: [SkillPhysicalVM, SkillMagicalVM],
      examples: {
        'Magical example': SkillMagicalVMExample,
        'Physical example': SkillPhysicalVMExample,
        'All example': [SkillMagicalVMExample, SkillPhysicalVMExample]
      }
    })
  })
  @ApiExtraModels(SkillPhysicalVM, SkillMagicalVM)
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get('')
  async getAllSkillsPaginated(@Query() pageOptions: PageOptionsRequest): Promise<PageVM<SkillVM>> {
    const page = await this.skillService.getAllPaginated({ pageOptions: pageOptions.toPageOptions() })
    return PageVM.fromPageWithVMS(page, page.items.map(FactorySkillVM.from))
  }

  @ApiOkResponse({
    description: 'Get a skill',
    content: generateResponseContent<SkillVM>({
      types: [SkillPhysicalVM, SkillMagicalVM],
      examples: {
        'Magical example': SkillMagicalVMExample,
        'Physical example': SkillPhysicalVMExample
      }
    })
  })
  @ApiExtraModels(SkillPhysicalVM, SkillMagicalVM)
  @HttpCode(HttpStatus.OK)
  @Get(':skillId')
  async getOneSkillById(@Param('skillId') skillId: string): Promise<SkillVM> {
    return FactorySkillVM.from(await this.skillService.getOneById(skillId))
  }

  @ApiOkResponse({
    description: 'Update a skill',
    content: generateResponseContent<SkillVM>({
      types: [SkillPhysicalVM, SkillMagicalVM],
      examples: {
        'Magical example': SkillMagicalVMExample,
        'Physical example': SkillPhysicalVMExample
      }
    })
  })
  @ApiExtraModels(UpdateSkillMagicalRequest, UpdateSkillPhysicalRequest)
  @ApiBody({
    description: 'Update Skill Request',
    required: true,
    ...generateRequestSchemasAndExamples<UpdateSkillRequest>({
      types: [UpdateSkillMagicalRequest, UpdateSkillPhysicalRequest],
      examples: {
        magical: UpdateSkillMagicalRequestExample,
        physical: UpdateSkillPhysicalRequestExample
      }
    })
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':skillId')
  async updateSkill(@Param('skillId') skillId: string, @Body() request: UpdateSkillRequest): Promise<SkillVM> {
    let skill: Skill
    if (UpdateSkillMagicalRequest.isSkillMagicalRequest(request)) {
      skill = await this.skillService.updateSkillMagical({
        skillId: skillId,
        skillMagicalToUpdate: {
          name: request.name,
          description: request.description,
          damage: request.damage,
          minimumLevel: request.minimumLevel,
          element: request.element,
          spellLevel: request.spellLevel
        }
      })
    } else if (UpdateSkillPhysicalRequest.isSkillPhysicalRequest(request)) {
      skill = await this.skillService.updateSkillPhysical({
        skillId: skillId,
        skillPhysicalToUpdate: {
          name: request.name,
          description: request.description,
          damage: request.damage,
          minimumLevel: request.minimumLevel,
          weaponType: request.weaponType
        }
      })
    } else {
      throw new HttpException('Wrong skill type', HttpStatus.BAD_REQUEST)
    }
    return FactorySkillVM.from(skill)
  }

  @ApiNoContentResponse({
    description: 'Delete a skill with matching id'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':skillId')
  async deleteSkillById(@Param('skillId') skillId: string): Promise<void> {
    await this.skillService.deleteOneSkill(skillId)
  }
}
