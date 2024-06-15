import { GuildRank } from '../../../../../../domain/models/guilds/GuildRank'
import { ApiProperty } from '@nestjs/swagger'

export class GuildMemberVM {
  @ApiProperty({
    description: 'The guild member rank',
    enum: GuildRank,
    enumName: 'GuildRank',
    type: GuildRank
  })
  rank: GuildRank
}

export const GuildMemberVMExample: GuildMemberVM = {
  rank: GuildRank.MEMBER
}
