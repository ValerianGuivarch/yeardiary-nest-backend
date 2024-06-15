import { GuildRank } from '../../../../../../domain/models/guilds/GuildRank'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

export class AddGuildMemberRequest {
  @ApiProperty({ description: 'The character id', type: String, format: 'uuid' })
  @IsUUID()
  characterId: string

  @ApiProperty({ description: 'The character rank', enum: GuildRank, enumName: 'GuildRank' })
  @IsEnum(GuildRank)
  rank: GuildRank
}

export const AddGuildMemberRequestExample = {
  characterId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  rank: GuildRank.MEMBER
}
