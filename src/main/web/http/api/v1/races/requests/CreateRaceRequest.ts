import { Size } from '../../../../../../domain/models/races/Size'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsString } from 'class-validator'

export class CreateRaceRequest {
  @ApiProperty({ description: 'The character name', type: String })
  @IsString()
  name: string

  @ApiProperty({ description: 'If the character sleep', type: Boolean })
  @IsBoolean()
  sleep: boolean

  @ApiProperty({ description: 'The character size', enumName: 'Size', enum: Size })
  @IsEnum(Size)
  size: Size
}

export const CreateRaceRequestExample = {
  name: 'Human',
  sleep: false,
  size: Size.MEDIUM
}
