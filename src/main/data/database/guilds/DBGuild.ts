import { Guild } from '../../../domain/models/guilds/Guild'
import { GuildWithoutMember } from '../../../domain/models/guilds/GuildMember'
import { DBGuildMember } from '../guilds_members/DBGuildMember'
import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity({ name: 'Guild' })
export class DBGuild {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ nullable: false })
  name: string

  @OneToMany(() => DBGuildMember, (guildMember) => guildMember.guild)
  members: DBGuildMember[]

  static readonly RELATIONS = {
    members: { character: { characterClasses: { classe: true }, race: true } }
  }

  static toGuild(dbGuild: DBGuild): Guild {
    return new Guild({
      id: dbGuild.id,
      name: dbGuild.name,
      members: dbGuild.members.map(DBGuildMember.toGuildMemberWithoutGuild)
    })
  }

  static toGuildWithoutMember(dbGuild: DBGuild): GuildWithoutMember {
    return new Guild({
      id: dbGuild.id,
      name: dbGuild.name,
      members: []
    })
  }
}

export type DBGuildToCreate = Omit<DBGuild, 'id' | 'members'>
export type DBGuildToUpdate = Pick<DBGuild, 'name' | 'updatedDate'>
