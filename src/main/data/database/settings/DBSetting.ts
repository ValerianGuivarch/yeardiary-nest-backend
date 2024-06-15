import { SettingType, SettingValue } from '../../../domain/models/settings/SettingType'
import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('Setting')
export class DBSetting {
  @PrimaryColumn({
    type: 'enum',
    enum: SettingType,
    unique: true
  })
  type: SettingType

  @Column('simple-json')
  value: SettingValue
}
