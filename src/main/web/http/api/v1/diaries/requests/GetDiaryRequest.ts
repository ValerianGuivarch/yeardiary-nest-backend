import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class GetDiaryRequest {
  @ApiProperty({ description: 'The diary day', type: Number })
  @IsNumber()
  day: number

  @ApiProperty({ description: 'The diary month', type: Number })
  @IsNumber()
  month: number
}
