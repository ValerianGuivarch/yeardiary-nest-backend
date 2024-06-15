export enum SettingType {
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
  DIFFICULTY_LEVEL = 'DIFFICULTY_LEVEL',
  ALLIES_LIST = 'ALLIES_LIST',
  GAME_TITLE = 'GAME_TITLE'
}

export type SettingValueType = {
  [SettingType.MAINTENANCE_MODE]: boolean
  [SettingType.DIFFICULTY_LEVEL]: number
  [SettingType.ALLIES_LIST]: string[]
  [SettingType.GAME_TITLE]: string
}
type ValueOf<T> = T[keyof T]
export type SettingValue = ValueOf<SettingValueType>

export const SettingTypeDefaultValue: SettingValueType = {
  [SettingType.MAINTENANCE_MODE]: false,
  [SettingType.DIFFICULTY_LEVEL]: 1,
  [SettingType.ALLIES_LIST]: [],
  [SettingType.GAME_TITLE]: 'default title'
}
