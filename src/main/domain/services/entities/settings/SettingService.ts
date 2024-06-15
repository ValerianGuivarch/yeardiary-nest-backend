import { SettingType, SettingValueType } from '../../../models/settings/SettingType'
import { ISettingProvider } from '../../../providers/settings/ISettingProvider'
import { Inject, Logger } from '@nestjs/common'

export class SettingService {
  private readonly logger = new Logger(SettingService.name)
  constructor(
    @Inject('ISettingProvider')
    private settingProvider: ISettingProvider
  ) {
    this.logger.log('SettingService')
  }

  async updateSetting<T extends SettingType>(
    type: T,
    value: SettingValueType[T]
  ): Promise<Record<SettingType, SettingValueType[SettingType]>> {
    return this.settingProvider.updateSetting(type, value)
  }

  async getAll(): Promise<Record<SettingType, SettingValueType[SettingType]>> {
    return this.settingProvider.getAll()
  }
}
