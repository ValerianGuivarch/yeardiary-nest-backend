import { ClasseVM, ClasseVMExample } from './entities/ClasseVM'
import { CreateClasseRequest, CreateClasseRequestExample } from './requests/CreateClasseRequest'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Classe, ClasseToUpdate } from '../../../../../domain/models/classes/Classe'
import { ClasseService } from '../../../../../domain/services/entities/classes/ClasseService'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
import { PageVM } from '../../utils/paginations/PageVM'
import { generateRequestSchemasAndExamples, generateResponseContent } from '../../utils/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/classes')
@UseGuards(RolesGuard)
@ApiTags('ClasseController')
@Roles(Authority.ADMIN, Authority.USER)
export class ClasseController {
  constructor(private readonly classeService: ClasseService) {}

  @ApiCreatedResponse({
    description: 'Create a new classe',
    content: generateResponseContent<ClasseVM>({
      types: ClasseVM,
      examples: {
        Example: ClasseVMExample
      }
    })
  })
  @ApiBody({
    description: 'Create a new classe',
    required: true,
    ...generateRequestSchemasAndExamples<CreateClasseRequest>({
      types: CreateClasseRequest,
      examples: {
        Example: CreateClasseRequestExample
      }
    })
  })
  @ApiBearerAuth()
  @Roles(Authority.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createClasse(@Body() request: CreateClasseRequest): Promise<ClasseVM> {
    const classe = await this.classeService.create(
      Classe.toClasseToCreate({
        name: request.name
      })
    )
    return ClasseVM.from(classe)
  }

  @ApiOkResponse({
    description: 'Get a classe with a given id',
    content: generateResponseContent<ClasseVM>({
      types: ClasseVM,
      examples: {
        Example: ClasseVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getClasseById(@Param('id') id: string): Promise<ClasseVM> {
    const classe = await this.classeService.getClasseById(id)
    return ClasseVM.from(classe)
  }

  @ApiOkResponse({
    description: 'Get all classes',
    content: generateResponseContent<ClasseVM>({
      types: ClasseVM,
      examples: {
        Example: ClasseVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllClasses(@Query() pageOptions: PageOptionsRequest): Promise<PageVM<ClasseVM>> {
    const page = await this.classeService.getAllClassesPaginated({
      pageOptions: pageOptions.toPageOptions()
    })
    return PageVM.fromPage(page)
  }

  @ApiOkResponse({
    description: 'Update a classe with a given id',
    content: generateResponseContent<ClasseVM>({
      types: Classe,
      examples: {
        Example: ClasseVMExample
      }
    })
  })
  @ApiBearerAuth()
  @Roles(Authority.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateClasse(p: { classeId: string; request: ClasseToUpdate }): Promise<ClasseVM> {
    const classe = await this.classeService.updateClasse({
      id: p.classeId,
      classeToUpdate: {
        name: p.request.name
      }
    })
    return ClasseVM.from(classe)
  }

  @ApiOkResponse({
    description: 'Delete a classe with a given id'
  })
  @ApiBearerAuth()
  @Roles(Authority.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':classeId')
  async deleteClasse(@Param('classeId') classeId: string): Promise<void> {
    await this.classeService.deleteOneClasse(classeId)
  }
}
