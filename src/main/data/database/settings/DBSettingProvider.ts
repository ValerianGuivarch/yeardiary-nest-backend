import { DBSetting } from './DBSetting'
import { SettingType, SettingTypeDefaultValue, SettingValueType } from '../../../domain/models/settings/SettingType'
import { ISettingProvider } from '../../../domain/providers/settings/ISettingProvider'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBSettingProvider implements ISettingProvider {
  constructor(
    @InjectRepository(DBSetting)
    private settingsRepository: Repository<DBSetting>
  ) {}

  async findOneByType<T extends SettingType>(type: T): Promise<SettingValueType[T]> {
    const setting = await this.settingsRepository.findOne({
      where: {
        type: type
      }
    })
    if (!setting) {
      return SettingTypeDefaultValue[type]
    }
    return setting.value as SettingValueType[T]
  }

  async getAll(): Promise<Record<SettingType, SettingValueType[SettingType]>> {
    const settings = await this.settingsRepository.find()
    const res: Record<SettingType, SettingValueType[SettingType]> = {
      ...SettingTypeDefaultValue
    }
    settings.forEach((setting) => {
      res[setting.type] = setting.value
    })
    return res
  }

  async updateSetting<T extends SettingType>(
    type: T,
    value: SettingValueType[T]
  ): Promise<Record<SettingType, SettingValueType[SettingType]>> {
    const setting = await this.settingsRepository.findOne({
      where: {
        type: type
      }
    })
    if (setting) {
      setting.value = value
      await this.settingsRepository.save(setting)
    } else {
      await this.settingsRepository.save({
        type: type,
        value: value
      })
    }
    return this.getAll()
  }
}
