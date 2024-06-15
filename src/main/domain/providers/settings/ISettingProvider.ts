import { SettingType, SettingValueType } from '../../models/settings/SettingType'

export interface ISettingProvider {
  findOneByType<T extends SettingType>(type: T): Promise<SettingValueType[T]>
  getAll(): Promise<Record<SettingType, SettingValueType[SettingType]>>
  updateSetting<T extends SettingType>(
    type: T,
    value: SettingValueType[T]
  ): Promise<Record<SettingType, SettingValueType[SettingType]>>
}
