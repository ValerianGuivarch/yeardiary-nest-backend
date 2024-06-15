import { SettingType, SettingValueType } from '../../../../../../domain/models/settings/SettingType'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, ValidateNested } from 'class-validator'

export class AdminUpdateSettingRequest {
  @ApiProperty({ description: 'The type of setting', enumName: 'SettingType', enum: SettingType })
  @IsEnum(SettingType)
  type: SettingType

  @ApiProperty({ description: 'The new value for the setting', type: Object })
  @ValidateNested()
  @Type(() => Object)
  value: SettingValueType[SettingType]
}

export const AdminUpdateSettingRequestExampleMaintenanceMode: AdminUpdateSettingRequest = {
  type: SettingType.MAINTENANCE_MODE,
  value: true
}
export const AdminUpdateSettingRequestExampleDifficultyLevel: AdminUpdateSettingRequest = {
  type: SettingType.DIFFICULTY_LEVEL,
  value: 2
}

export const AdminUpdateSettingRequestExampleAlliesList: AdminUpdateSettingRequest = {
  type: SettingType.ALLIES_LIST,
  value: ['allies1', 'allies2']
}

export const AdminUpdateSettingRequestExampleGameTitle: AdminUpdateSettingRequest = {
  type: SettingType.GAME_TITLE,
  value: 'gameTitle'
}
