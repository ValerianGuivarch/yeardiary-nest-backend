import { RaceVM, RaceVMExample } from './entities/RaceVM'
import { CreateRaceRequest } from './requests/CreateRaceRequest'
import { UpdateRaceRequest } from './requests/UpdateRaceRequest'
import { Account } from '../../../../../domain/models/accounts/Account'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Race } from '../../../../../domain/models/races/Race'
import { RaceService } from '../../../../../domain/services/entities/races/RaceService'
import { CurrentAccountDecorator } from '../../decorators/CurrentAccountDecorator'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { PageOptionsRequest } from '../../utils/paginations/PageOptionsRequest'
import { PageVM } from '../../utils/paginations/PageVM'
import { generatePageResponseContent, generateResponseContent } from '../../utils/swagger'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/races')
@UseGuards(RolesGuard)
@ApiTags('Races')
@Roles(Authority.ADMIN, Authority.USER)
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @ApiCreatedResponse({
    description: 'Create a new race for account',
    type: RaceVM
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createNewRace(@Body() request: CreateRaceRequest): Promise<RaceVM> {
    return RaceVM.from(
      await this.raceService.createRace(
        Race.toRaceToCreate({
          name: request.name,
          sleep: request.sleep,
          size: request.size
        })
      )
    )
  }

  @ApiOkResponse({
    description: 'Get all races',
    content: generatePageResponseContent({
      types: RaceVM,
      examples: {
        Races: RaceVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllRaces(@Query() pageOptionsRequest: PageOptionsRequest): Promise<PageVM<RaceVM>> {
    const races = await this.raceService.getAllRacesPaginated({
      pageOptions: pageOptionsRequest.toPageOptions()
    })
    return PageVM.fromPage(races)
  }

  @ApiOkResponse({
    description: 'Get a race by id',
    content: generateResponseContent({
      types: RaceVM,
      examples: {
        'Race found': RaceVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':raceId')
  async getRaceById(@Param('raceId') raceId: string): Promise<RaceVM> {
    return RaceVM.from(await this.raceService.getOneRaceById(raceId))
  }

  @ApiOkResponse({
    description: 'Update a race',
    type: RaceVM
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put(':raceId')
  async updateRaceById(@Param('raceId') raceId: string, @Body() request: UpdateRaceRequest): Promise<RaceVM> {
    return RaceVM.from(
      await this.raceService.updateRace({
        raceId: raceId,
        raceToUpdate: {
          size: request.size,
          sleep: request.sleep,
          name: request.name
        }
      })
    )
  }

  @ApiOkResponse({
    description: 'Delete a race by id'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete(':raceId')
  async deleteRaces(
    @CurrentAccountDecorator() currentAccount: Account,
    @Param('raceId') raceId: string
  ): Promise<void> {
    await this.raceService.deleteOneRace(raceId)
  }
}
