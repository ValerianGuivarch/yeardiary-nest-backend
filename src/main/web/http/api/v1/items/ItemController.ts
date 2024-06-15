import { ItemVM, ItemVMExample } from './entities/ItemVM'
import { CreateItemRequest, CreateItemRequestExample } from './requests/CreateItemRequest'
import { UpdateItemRequest } from './requests/UpdateItemRequest'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Item } from '../../../../../domain/models/items/Item'
import { Page } from '../../../../../domain/models/utils/pages/Page'
import { ItemService } from '../../../../../domain/services/entities/items/ItemService'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
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
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/items')
@UseGuards(RolesGuard)
@ApiTags('Items')
@Roles(Authority.ADMIN, Authority.USER)
export class CharacterController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOkResponse({
    description: 'Create a new item for character',
    content: generateResponseContent<ItemVM>({
      types: ItemVM,
      examples: {
        Example: ItemVMExample
      }
    })
  })
  @ApiBody({
    description: 'Create a new item for character',
    required: true,
    ...generateRequestSchemasAndExamples<CreateItemRequest>({
      types: CreateItemRequest,
      examples: {
        Example: CreateItemRequestExample
      }
    })
  })
  @Roles(Authority.ADMIN, Authority.USER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('')
  async createItem(@Body() request: CreateItemRequest): Promise<ItemVM> {
    const item = await this.itemService.createItem({
      characterId: request.characterId,
      itemToCreate: Item.toItemToCreate({
        name: request.name
      })
    })
    return ItemVM.from(item)
  }

  @ApiOkResponse({
    description: 'Get a specific item of a character',
    content: generateResponseContent<ItemVM>({
      types: ItemVM,
      examples: {
        Example: ItemVMExample
      }
    })
  })
  @Roles(Authority.ADMIN, Authority.USER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<ItemVM> {
    const item = await this.itemService.getItemById(id)
    return ItemVM.from(item)
  }

  @ApiOkResponse({
    description: 'Get all items of a character',
    content: generatePageResponseContent({
      types: ItemVM,
      examples: {
        Example: ItemVMExample
      }
    })
  })
  @Roles(Authority.ADMIN, Authority.USER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async findAllPaginatedByCharacterId(
    @Query() pageOptionsRequest: PageOptionsRequest,
    @Query('characterId') characterId: string
  ): Promise<Page<ItemVM>> {
    const items = await this.itemService.getAllPaginatedByCharacterId({
      characterId: characterId,
      pageOptions: pageOptionsRequest.toPageOptions()
    })
    return items.map(ItemVM.from)
  }

  @ApiOkResponse({
    description: 'Update an item of a character',
    content: generateResponseContent<ItemVM>({
      types: ItemVM,
      examples: {
        Example: ItemVMExample
      }
    })
  })
  @Roles(Authority.ADMIN, Authority.USER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateItem(@Param('id') id: string, @Body() request: UpdateItemRequest): Promise<Item> {
    const item = await this.itemService.updateItem({
      itemId: id,
      itemToUpdate: {
        used: request.used
      }
    })
    return ItemVM.from(item)
  }

  @ApiOkResponse({
    description: 'Delete an item of a character'
  })
  @Roles(Authority.ADMIN, Authority.USER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':itemId')
  async deleteItem(@Param('itemId') itemId: string): Promise<void> {
    await this.itemService.deleteOneItem(itemId)
  }
}
