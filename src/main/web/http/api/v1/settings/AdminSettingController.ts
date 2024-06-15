import { AdminSettingsVM, AdminSettingVMExamples } from './entities/AdminSettingsVM'
import {
  AdminUpdateSettingRequest,
  AdminUpdateSettingRequestExampleAlliesList,
  AdminUpdateSettingRequestExampleDifficultyLevel,
  AdminUpdateSettingRequestExampleGameTitle,
  AdminUpdateSettingRequestExampleMaintenanceMode
} from './requests/AdminUpdateSettingRequest'
import { Authority } from '../../../../../domain/models/accounts/Authority'
import { SettingService } from '../../../../../domain/services/entities/settings/SettingService'
import { Roles } from '../../decorators/RolesDecorator'
import { RolesGuard } from '../../guards/RolesGuard'
import { generateRequestSchemasAndExamples, generateResponseContent } from '../../utils/swagger'
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('api/v1/admin/settings')
@UseGuards(RolesGuard)
@ApiTags('AdminSettings')
@Roles(Authority.ADMIN)
@ApiBearerAuth()
export class AdminSettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiOkResponse({
    description: 'update setting value',
    content: generateResponseContent<AdminSettingsVM>({
      types: AdminSettingsVM,
      examples: {
        Example: AdminSettingVMExamples
      }
    })
  })
  @ApiExtraModels(AdminSettingsVM, AdminUpdateSettingRequest)
  @ApiBody({
    description: 'update setting value',
    required: true,
    ...generateRequestSchemasAndExamples<AdminUpdateSettingRequest>({
      types: AdminUpdateSettingRequest,
      examples: {
        'Maintenance Mode': AdminUpdateSettingRequestExampleMaintenanceMode,
        'Difficulty Level': AdminUpdateSettingRequestExampleDifficultyLevel,
        'Allies List': AdminUpdateSettingRequestExampleAlliesList,
        'Game Title': AdminUpdateSettingRequestExampleGameTitle
      }
    })
  })
  @HttpCode(HttpStatus.OK)
  @Patch('')
  async update(@Body() request: AdminUpdateSettingRequest): Promise<AdminSettingsVM> {
    const settings = await this.settingService.updateSetting(request.type, request.value)
    return AdminSettingsVM.from(settings)
  }

  @ApiOkResponse({
    description: 'Get setting values',
    content: generateResponseContent<AdminSettingsVM>({
      types: AdminSettingsVM,
      examples: {
        Example: AdminSettingVMExamples
      }
    })
  })
  @ApiExtraModels(AdminSettingsVM, AdminUpdateSettingRequest)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getSettings(): Promise<AdminSettingsVM> {
    const settings = await this.settingService.getAll()
    return AdminSettingsVM.from(settings)
  }
}
