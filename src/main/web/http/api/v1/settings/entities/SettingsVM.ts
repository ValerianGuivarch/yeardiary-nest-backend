import { SettingType, SettingValueType } from '../../../../../../domain/models/settings/SettingType'
import { ApiProperty } from '@nestjs/swagger'

export class SettingsVM {
  @ApiProperty({ description: 'The maintenance mode setting', type: Boolean })
  maintenanceMode: boolean

  @ApiProperty({ description: 'The game title setting', type: String })
  gameTitle: string

  constructor(settings: SettingsVM) {
    this.maintenanceMode = settings.maintenanceMode
    this.gameTitle = settings.gameTitle
  }

  static from(settings: Record<SettingType, SettingValueType[SettingType]>): SettingsVM {
    return new SettingsVM({
      maintenanceMode: settings.MAINTENANCE_MODE as SettingValueType[SettingType.MAINTENANCE_MODE],
      gameTitle: settings.GAME_TITLE as SettingValueType[SettingType.GAME_TITLE]
    })
  }
}

export const SettingsVMExample: SettingsVM = {
  maintenanceMode: true,
  gameTitle: 'gameTitle'
}
