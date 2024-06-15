import { GuildVM, GuildVMExample } from './entities/GuildVM'
import { AddGuildMemberRequest } from './requests/AddGuildMemberRequest'
import { CreateGuildRequest } from './requests/CreateGuildRequest'
import { UpdateGuildMemberRequest } from './requests/UpdateGuildMemberRequest'
import { UpdateGuildRequest } from './requests/UpdateGuildRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Guild } from '../../../../../domain/models/guilds/Guild'
import { GuildService } from '../../../../../domain/services/entities/guilds/GuildService'
import { CurrentAccountDecorator } from '../../decorators/CurrentAccountDecorator'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
import { PageVM } from '../../utils/paginations/PageVM'
import { generatePageResponseContent, generateResponseContent } from '../../utils/swagger'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/guilds')
@UseGuards(RolesGuard)
@ApiTags('Guilds')
@Roles(Authority.ADMIN, Authority.USER)
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @ApiCreatedResponse({
    description: 'Create a new guild',
    content: generateResponseContent<Omit<GuildVM, 'members'>>({
      types: GuildVM,
      examples: {
        'Created Guild': GuildVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createNewGuild(
    @CurrentAccountDecorator() currentAccount: Account,
    @Body() request: CreateGuildRequest
  ): Promise<GuildVM> {
    return GuildVM.from(
      await this.guildService.createGuild(
        Guild.toGuildToCreate({
          name: request.name
        })
      )
    )
  }

  @ApiOkResponse({
    description: 'Get all guilds',
    content: generatePageResponseContent({
      types: GuildVM,
      examples: {
        Guilds: GuildVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllGuilds(
    @CurrentAccountDecorator() currentAccount: Account,
    @Query() pageOptionsRequest: PageOptionsRequest
  ): Promise<PageVM<GuildVM>> {
    const guilds = await this.guildService.getAllGuildsPaginated({
      account: currentAccount,
      pageOptions: pageOptionsRequest.toPageOptions()
    })

    return PageVM.fromPage(guilds.map(GuildVM.from))
  }

  @ApiOkResponse({
    description: 'Get a guild by id',
    content: generateResponseContent({
      types: GuildVM,
      examples: {
        'Found Guild': GuildVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':guildId')
  async getGuildById(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('guildId') guildId: string
  ): Promise<GuildVM> {
    return GuildVM.from(await this.guildService.getGuildById(guildId))
  }

  @ApiOkResponse({
    description: 'Update a guild',
    content: generateResponseContent({
      types: GuildVM,
      examples: {
        'Updated Guild': GuildVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put(':guildId')
  async updateGuildById(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('guildId') guildId: string,
    @Body() request: UpdateGuildRequest
  ): Promise<GuildVM> {
    return GuildVM.from(
      await this.guildService.updateGuild({
        guildId: guildId,
        guild: {
          name: request.name
        }
      })
    )
  }

  @ApiOkResponse({
    description: 'Delete a guild by id'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':guildId')
  async deleteGuilds(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('guildId') guildId: string
  ): Promise<void> {
    await this.guildService.deleteOneGuild(guildId)
  }

  @ApiCreatedResponse({
    description: 'Add a new member for a guild',
    type: GuildVM
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post(':guildId/members/:characterId')
  async addMemberToGuild(
    @CurrentAccountDecorator() currentAccount: Account,
    @Body() request: AddGuildMemberRequest,
    @Param('guildId') guildId: string,
    @Param('characterId') characterId: string
  ): Promise<GuildVM> {
    return GuildVM.from(
      await this.guildService.addMembersToGuild({
        guild: {
          id: guildId
        },
        character: {
          id: characterId
        },
        rank: request.rank
      })
    )
  }

  @ApiOkResponse({
    description: 'Update a guild member',
    type: GuildVM
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put(':guildId/members')
  async updateGuildMemberById(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('guildId') guildId: string,
    @Body() request: UpdateGuildMemberRequest
  ): Promise<GuildVM> {
    return GuildVM.from(
      await this.guildService.updateGuildMember({
        guildId: guildId,
        characterId: request.characterId,
        memberToUpdate: {
          rank: request.rank
        }
      })
    )
  }

  @ApiOkResponse({
    description: 'Remove guild members'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':guildId/members')
  async deleteGuildMembers(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('guildId') guildId: string,
    @Query('characterIds') characterIds: string[]
  ): Promise<void> {
    await this.guildService.removeMember({
      guildId: guildId,
      characterIds: characterIds
    })
  }
}
