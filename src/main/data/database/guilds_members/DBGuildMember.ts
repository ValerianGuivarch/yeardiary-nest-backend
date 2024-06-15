import { GuildMemberWithoutMember } from '../../../domain/models/characters/Character'
import { GuildMemberWithoutGuild } from '../../../domain/models/guilds/Guild'
import { GuildMember } from '../../../domain/models/guilds/GuildMember'
import { GuildRank } from '../../../domain/models/guilds/GuildRank'
import { DBCharacter } from '../characters/DBCharacter'
import { DBGuild } from '../guilds/DBGuild'
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm'
@Entity('GuildMember')
export class DBGuildMember {
  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ enum: GuildRank, enumName: 'GuildRank' })
  rank: GuildRank

  @PrimaryColumn({ type: 'uuid' })
  characterId: string

  @ManyToOne(() => DBCharacter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'characterId' })
  character: DBCharacter

  @PrimaryColumn({ type: 'uuid' })
  guildId: string

  @ManyToOne(() => DBGuild, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild: DBGuild

  static readonly RELATIONS = { character: true, guild: true }

  static toGuildMember(dbGuildMember: DBGuildMember): GuildMember {
    return {
      guild: DBGuild.toGuild(dbGuildMember.guild),
      member: DBCharacter.toCharacter(dbGuildMember.character),
      rank: dbGuildMember.rank
    }
  }

  static toGuildMemberWithoutGuild(dbGuildMember: DBGuildMember): GuildMemberWithoutGuild {
    return {
      member: DBCharacter.toCharacterWithoutGuild(dbGuildMember.character),
      rank: dbGuildMember.rank
    }
  }

  static toGuildMemberWithoutMember(dbGuildMember: DBGuildMember): GuildMemberWithoutMember {
    return {
      guild: DBGuild.toGuildWithoutMember(dbGuildMember.guild),
      rank: dbGuildMember.rank
    }
  }
}
