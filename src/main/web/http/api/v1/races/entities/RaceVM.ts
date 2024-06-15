import { Race } from '../../../../../../domain/models/races/Race'
import { Size } from '../../../../../../domain/models/races/Size'
import { ApiProperty } from '@nestjs/swagger'

export class RaceVM {
  @ApiProperty({ description: 'The character id', type: String, format: 'uuid' })
  id: string

  @ApiProperty({ description: 'The character name', type: String })
  name: string

  @ApiProperty({ description: 'If the character sleep', type: Boolean })
  sleep: boolean

  @ApiProperty({ description: 'The character size', enumName: 'Size', enum: Size })
  size: Size

  constructor(race: RaceVM) {
    this.id = race.id
    this.name = race.name
    this.sleep = race.sleep
    this.size = race.size
  }

  static from(race: Race): RaceVM {
    return new RaceVM({
      id: race.id,
      name: race.name,
      sleep: race.sleep,
      size: race.size
    })
  }
}

export const RaceVMExample: RaceVM = {
  id: '09691b8d-5cc1-4966-b614-d0f04f6422fd',
  name: 'Human',
  sleep: false,
  size: Size.MEDIUM
}
