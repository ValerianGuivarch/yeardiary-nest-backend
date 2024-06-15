import { SettingsVM, SettingsVMExample } from './entities/SettingsVM'
import { SettingService } from '../../../../../domain/services/entities/settings/SettingService'
import { Public } from '../../decorators/PublicDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { generateResponseContent } from '../../utils/swagger'
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/settings')
@UseGuards(RolesGuard)
@ApiTags('Settings')
@Public()
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiOkResponse({
    description: 'Get setting values',
    content: generateResponseContent<SettingsVM>({
      types: SettingsVM,
      examples: {
        Example: SettingsVMExample
      }
    })
  })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getSettings(): Promise<SettingsVM> {
    const settings = await this.settingService.getAll()
    return SettingsVM.from(settings)
  }
}
