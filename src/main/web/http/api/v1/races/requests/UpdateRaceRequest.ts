import { Size } from '../../../../../../domain/models/races/Size'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateRaceRequest {
  @ApiPropertyOptional({ description: 'The character name', type: String })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'If the character sleep', type: Boolean })
  @IsOptional()
  @IsBoolean()
  sleep?: boolean

  @ApiPropertyOptional({ description: 'The character size', enumName: 'Size', enum: Size })
  @IsOptional()
  @IsEnum(Size)
  size?: Size
}

export const UpdateRaceRequestExample = {
  name: 'Human',
  sleep: false,
  size: Size.MEDIUM
}
