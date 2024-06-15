import { GuildRank } from '../../../../../../domain/models/guilds/GuildRank'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

export class UpdateGuildMemberRequest {
  @ApiProperty({ description: 'The character id', type: String, format: 'uuid' })
  @IsUUID()
  characterId: string

  @ApiPropertyOptional({ description: 'The new guild rank', enum: GuildRank, enumName: 'GuildRank' })
  @IsEnum(GuildRank)
  rank: GuildRank
}

export const UpdateGuildMemberRequestExample = {
  characterId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  rank: GuildRank.MEMBER
}
