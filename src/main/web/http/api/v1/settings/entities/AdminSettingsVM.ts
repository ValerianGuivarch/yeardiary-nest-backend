import { SettingType, SettingValueType } from '../../../../../../domain/models/settings/SettingType'
import { ApiProperty } from '@nestjs/swagger'

export class AdminSettingsVM {
  @ApiProperty({ description: 'The maintenance mode setting', type: Boolean })
  maintenanceMode: boolean

  @ApiProperty({ description: 'The game difficulty level setting', type: Number })
  difficultyLevel: number

  @ApiProperty({ description: 'The allies list', isArray: true, type: String })
  alliesList: string[]

  @ApiProperty({ description: 'The game title setting', type: String })
  gameTitle: string

  constructor(settings: AdminSettingsVM) {
    this.maintenanceMode = settings.maintenanceMode
    this.gameTitle = settings.gameTitle
    this.difficultyLevel = settings.difficultyLevel
    this.alliesList = settings.alliesList
  }

  static from(settings: Record<SettingType, SettingValueType[SettingType]>): AdminSettingsVM {
    return new AdminSettingsVM({
      maintenanceMode: settings.MAINTENANCE_MODE as SettingValueType[SettingType.MAINTENANCE_MODE],
      difficultyLevel: settings.DIFFICULTY_LEVEL as SettingValueType[SettingType.DIFFICULTY_LEVEL],
      alliesList: settings.ALLIES_LIST as SettingValueType[SettingType.ALLIES_LIST],
      gameTitle: settings.GAME_TITLE as SettingValueType[SettingType.GAME_TITLE]
    })
  }
}

export const AdminSettingVMExamples: AdminSettingsVM = {
  maintenanceMode: true,
  difficultyLevel: 1,
  alliesList: ['allies1', 'allies2'],
  gameTitle: 'gameTitle'
}
