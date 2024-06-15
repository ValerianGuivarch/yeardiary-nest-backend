import { BattleVM, BattleVMExample } from './entities/BattleVM'
import { AttackCharacterInBattleRequest } from './requests/AttackCharacterInBattleRequest'
import { CreateBattleRequest, CreateBattleRequestExample } from './requests/CreateBattleRequest'
import { UpdateBattleRequest } from './requests/UpdateBattleRequest'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { Battle } from '../../../../../domain/models/battles/Battle'
import { BattleService } from '../../../../../domain/services/entities/battles/BattleService'
import { BattleActionService } from '../../../../../domain/services/workflows/battle_action/BattleActionService'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { generateRequestSchemasAndExamples, generateResponseContent } from '../../utils/swagger'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/battles')
@UseGuards(RolesGuard)
@ApiTags('Battles')
@Roles(Authority.ADMIN, Authority.USER)
export class BattleController {
  constructor(
    private readonly battleService: BattleService,
    private readonly battleActionService: BattleActionService
  ) {}

  @ApiCreatedResponse({
    description: 'Create a new battle',
    content: generateResponseContent<BattleVM>({
      types: BattleVM,
      examples: {
        Example: BattleVMExample
      }
    })
  })
  @ApiBody({
    description: 'Create a new battle',
    required: true,
    ...generateRequestSchemasAndExamples<CreateBattleRequest>({
      types: CreateBattleRequest,
      examples: {
        Example: CreateBattleRequestExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createBattle(@Body() createBattleRequest: CreateBattleRequest): Promise<BattleVM> {
    return BattleVM.from(
      await this.battleService.createBattle(
        Battle.toBattleToCreate({
          strongElement: createBattleRequest.strongElement,
          weakElement: createBattleRequest.weakElement
        })
      )
    )
  }

  @ApiOkResponse({
    description: 'Get a battle using its id',
    content: generateResponseContent<BattleVM>({
      types: BattleVM,
      examples: {
        Example: BattleVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':battleId')
  async getBattleById(@Param('battleId') battleId: string): Promise<BattleVM> {
    return BattleVM.from(await this.battleService.getOneBattleById(battleId))
  }

  @ApiOkResponse({
    description: 'Update a battle using its id',
    content: generateResponseContent<BattleVM>({
      types: BattleVM,
      examples: {
        Example: BattleVMExample
      }
    })
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Patch(':battleId')
  async updateBattleById(
    @Param('battleId') battleId: string,
    @Body() updateBattleRequest: UpdateBattleRequest
  ): Promise<BattleVM> {
    return BattleVM.from(
      await this.battleService.updateBattle({
        battleId: battleId,
        battleToUpdate: {
          strongElement: updateBattleRequest.strongElement,
          weakElement: updateBattleRequest.weakElement
        }
      })
    )
  }

  @ApiOkResponse({ description: 'Delete a battle using its id' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':battleId')
  async deleteBattleById(@Param('battleId') battleId: string): Promise<void> {
    await this.battleService.deleteOneBattleById(battleId)
  }

  @ApiOkResponse({ description: 'Use an offensive skill against another character' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post(':battleId/attack-character')
  async attackCharacter(
    @Param('battleId') battleId: string,
    @Body() attackCharacterInBattleRequest: AttackCharacterInBattleRequest
  ): Promise<void> {
    await this.battleActionService.useOffensiveSkill({
      battleId: battleId,
      skillId: attackCharacterInBattleRequest.skillId,
      targetId: attackCharacterInBattleRequest.targetId,
      userId: attackCharacterInBattleRequest.userId
    })
  }
}
