import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class AttackCharacterInBattleRequest {
  @ApiProperty({
    description: 'The attacking character uuid',
    type: String,
    format: 'uuid'
  })
  @IsUUID()
  userId: string

  @ApiProperty({
    description: 'The target character uuid',
    type: String,
    format: 'uuid'
  })
  @IsUUID()
  targetId: string

  @ApiProperty({
    description: 'The skill uuid',
    type: String,
    format: 'uuid'
  })
  @IsUUID()
  skillId: string
}

export const AttackCharacterInBattleRequestExample: AttackCharacterInBattleRequest = {
  skillId: '7e10b226-9d89-4bf5-a606-c5660630eeab',
  targetId: 'eed03ffc-2296-410b-aeaf-55c9cdb87117',
  userId: '1cbec518-efd4-4e09-ba8a-32c77c9a3c56'
}
