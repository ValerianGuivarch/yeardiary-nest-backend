import { CharacterClasseVM, CharacterClasseVMExample } from './entities/CharacterClasseVM'
import { CharacterVM, CharacterVMExample } from './entities/CharacterVM'
import {
  CreateCharacterClassRequest,
  CreateCharacterClassRequestExample
} from './requests/CreateCharacterClasseRequest'
import { CreateCharacterRequest, CreateCharacterRequestExample } from './requests/CreateCharacterRequest'
import { UpdateCharacterClassRequest } from './requests/UpdateCharacterClasseRequest'
import { UpdateCharacterRequest } from './requests/UpdateCharacterRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Character } from '../../../../../domain/models/characters/Character'
import { CharacterService } from '../../../../../domain/services/entities/characters/CharacterService'
import { CurrentAccountDecorator } from '../../decorators/CurrentAccountDecorator'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
import { PageVM } from '../../utils/paginations/PageVM'
import {
  generatePageResponseContent,
  generateRequestSchemasAndExamples,
  generateResponseContent
} from '../../utils/swagger'
import { FileInterceptor } from '@nest-lab/fastify-multer'
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
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/characters')
@UseGuards(RolesGuard)
@ApiTags('Characters')
@Roles(Authority.ADMIN, Authority.USER)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @ApiCreatedResponse({
    description: 'Create a new character for account',
    content: generateResponseContent<CharacterVM>({
      types: CharacterVM,
      examples: {
        Example: CharacterVMExample
      }
    })
  })
  @ApiBody({
    description: 'Create a new character for account',
    required: true,
    ...generateRequestSchemasAndExamples<CreateCharacterRequest>({
      types: CreateCharacterRequest,
      examples: {
        Example: CreateCharacterRequestExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createNewCharacter(
    @CurrentAccountDecorator() currentAccount: Account,
    @Body() request: CreateCharacterRequest
  ): Promise<CharacterVM> {
    return CharacterVM.from(
      await this.characterService.createCharacter(
        Character.toCharacterToCreate({
          accountId: currentAccount.id,
          name: request.name,
          level: request.level,
          invokerId: request.invokerId,
          raceId: request.raceId,
          classes: request.classes.map((classe) => {
            return {
              classe: {
                id: classe.classeId
              },
              level: classe.level
            }
          })
        })
      )
    )
  }

  @ApiOkResponse({
    description: 'Get all characters',
    content: generatePageResponseContent<CharacterVM>({
      types: CharacterVM,
      examples: {
        Example: CharacterVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllCharacters(
    @CurrentAccountDecorator() currentAccount: Account,
    @Query() pageOptionsRequest: PageOptionsRequest
  ): Promise<PageVM<CharacterVM>> {
    const characters = await this.characterService.getAllCharactersPaginated({
      account: currentAccount,
      pageOptions: pageOptionsRequest.toPageOptions()
    })

    return PageVM.fromPage(characters.map(CharacterVM.from))
  }

  @ApiOkResponse({
    description: 'Get a character by id',
    content: generateResponseContent<CharacterVM>({
      types: CharacterVM,
      examples: {
        Example: CharacterVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':characterId')
  async getCharacterById(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('characterId') characterId: string
  ): Promise<CharacterVM> {
    return CharacterVM.from(await this.characterService.getCharacterById(characterId))
  }

  @ApiOkResponse({
    description: 'Update a character',
    content: generateResponseContent<CharacterVM>({
      types: CharacterVM,
      examples: {
        Example: CharacterVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Patch(':characterId')
  async updateCharacterById(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('characterId') characterId: string,
    @Body() request: UpdateCharacterRequest
  ): Promise<CharacterVM> {
    return CharacterVM.from(
      await this.characterService.updateCharacter({
        characterId: characterId,
        character: {
          level: request.level,
          name: request.name
        }
      })
    )
  }

  @ApiOkResponse({
    description: 'Delete a character by id'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':characterId')
  async deleteCharacters(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('characterId') characterId: string
  ): Promise<void> {
    await this.characterService.deleteOneCharacter(characterId)
  }

  @ApiOkResponse({
    description: 'Create a character classe',
    content: generateResponseContent<CharacterClasseVM>({
      types: CharacterClasseVM,
      examples: {
        Example: CharacterClasseVMExample
      }
    })
  })
  @ApiBody({
    description: 'Create a character classe',
    required: true,
    ...generateRequestSchemasAndExamples<CreateCharacterClassRequest>({
      types: CreateCharacterClassRequest,
      examples: {
        Example: CreateCharacterClassRequestExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post(':characterId/classes/:classeId')
  async createCharacterClasse(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('characterId') characterId: string,
    @Param('classeId') classeId: string,
    @Body() request: CreateCharacterClassRequest
  ): Promise<CharacterClasseVM> {
    const characterClasse = await this.characterService.createCharacterClasse({
      characterId: characterId,
      classeId: classeId,
      level: request.level
    })
    return CharacterClasseVM.from(characterClasse)
  }

  @ApiOkResponse({
    description: 'Update a character classe',
    content: generateResponseContent<CharacterClasseVM>({
      types: CharacterClasseVM,
      examples: {
        Example: CharacterClasseVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Patch(':characterId/classes/:classeId')
  async updateCharacterClasse(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('characterId') characterId: string,
    @Param('classeId') classeId: string,
    @Body() request: UpdateCharacterClassRequest
  ): Promise<CharacterClasseVM> {
    const characterClasse = await this.characterService.updateCharacterClasse({
      characterId: characterId,
      classeId: classeId,
      level: request.level
    })
    return CharacterClasseVM.from(characterClasse)
  }

  @ApiOkResponse({
    description: 'Delete a character classe'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':characterId/classes/:classeId')
  async deleteCharacterClasse(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('characterId') characterId: string,
    @Param('classeId') classeId: string
  ): Promise<void> {
    await this.characterService.deleteCharacterClasse({
      characterId: characterId,
      classeId: classeId
    })
  }

  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Upload a character picture',
    content: generateResponseContent<CharacterVM>({
      types: CharacterVM,
      examples: {
        Example: CharacterVMExample
      }
    })
  })
  @Roles(Authority.ADMIN, Authority.USER)
  @Post(':characterId/upload-picture')
  @UseInterceptors(FileInterceptor('picture'))
  async uploadPicture(
    @Param('characterId') characterId: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<CharacterVM> {
    const character = await this.characterService.uploadCharacterPicture(characterId, file)
    return CharacterVM.from(character)
  }
}
