import { Character } from '../../../domain/models/characters/Character'
import { CharacterWithoutGuild } from '../../../domain/models/guilds/GuildMember'
import { DBAccount } from '../accounts/DBAccount'
import { DBCharacterClasse } from '../character_classes/DBCharacterClasse'
import { DBGuildMember } from '../guilds_members/DBGuildMember'
import { DBItem } from '../items/DBItem'
import { DBRace } from '../races/DBRace'
import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm'

@Entity({ name: 'Character' })
export class DBCharacter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ nullable: false })
  name: string

  @Column({ default: 1 })
  level: number

  @Column()
  accountId: string

  @ManyToOne(() => DBAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account?: DBAccount

  @Column({ nullable: true })
  invokerId?: string

  @ManyToOne(() => DBCharacter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invokerId' })
  invoker?: DBCharacter

  @OneToMany(() => DBCharacterClasse, (characterClasse) => characterClasse.character)
  characterClasses: DBCharacterClasse[]

  @OneToMany(() => DBItem, (item) => item.character)
  items: DBItem[]

  @Column()
  picture?: string

  @Column({ type: 'integer', default: 0 })
  damageTaken: number

  @Column()
  raceId: string

  @ManyToOne(() => DBRace)
  @JoinColumn({ name: 'raceId' })
  race: DBRace

  @OneToMany(() => DBGuildMember, (guildMember) => guildMember.character)
  guilds: DBGuildMember[]

  static readonly RELATIONS = {
    characterClasses: { classe: { skills: { skill: true } } },
    race: true,
    guilds: { guild: true }
  }

  static toCharacter(dbCharacter: DBCharacter): Character {
    return new Character({
      accountId: dbCharacter.accountId,
      id: dbCharacter.id,
      invokerId: dbCharacter.invokerId,
      level: dbCharacter.level,
      name: dbCharacter.name,
      picture: dbCharacter.picture,
      damageTaken: dbCharacter.damageTaken,
      race: DBRace.toRace(dbCharacter.race),
      classes: dbCharacter.characterClasses.map(DBCharacterClasse.toCharacterClasse),
      guilds: dbCharacter.guilds.map(DBGuildMember.toGuildMemberWithoutMember)
    })
  }

  static toCharacterWithoutGuild(dbCharacter: DBCharacter): CharacterWithoutGuild {
    return new Character({
      accountId: dbCharacter.accountId,
      id: dbCharacter.id,
      invokerId: dbCharacter.invokerId,
      level: dbCharacter.level,
      name: dbCharacter.name,
      picture: dbCharacter.picture,
      damageTaken: dbCharacter.damageTaken,
      race: DBRace.toRace(dbCharacter.race),
      classes: dbCharacter.characterClasses.map(DBCharacterClasse.toCharacterClasse),
      guilds: []
    })
  }
}

export type DBCharacterToCreate = Omit<
  DBCharacter,
  'id' | 'account' | 'invoker' | 'characterClasses' | 'race' | 'guilds' | 'picture' | 'items'
>
export type DBCharacterToUpdate = Pick<DBCharacter, 'name' | 'level' | 'picture' | 'updatedDate'>
