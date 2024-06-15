import { Battle } from '../../../domain/models/battles/Battle'
import { MagicElement } from '../../../domain/models/skills/MagicElement'
import { DBCharacterBattle } from '../character_battle/DBCharacterBattle'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('Battle')
export class DBBattle {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ type: 'integer', default: 0 })
  currentTurn: number

  @Column('text', { array: true, default: {} })
  alreadyActedCharacters: string[]

  @Column({ type: 'varchar' })
  strongElement: MagicElement

  @Column({ type: 'varchar' })
  weakElement: MagicElement

  @Column({ type: 'boolean' })
  isOver: boolean

  @OneToMany(() => DBCharacterBattle, (characterBattle) => characterBattle.battle)
  characters: DBCharacterBattle[]

  static readonly RELATIONS = {
    characters: { character: { characterClasses: { classe: true }, race: true, guilds: { guild: true } } }
  }
  static toBattle(dbBattle: DBBattle): Battle {
    return new Battle({
      alreadyActedCharacters: dbBattle.alreadyActedCharacters,
      characters: dbBattle.characters.map(DBCharacterBattle.toCharacterBattle),
      currentTurn: dbBattle.currentTurn,
      id: dbBattle.id,
      strongElement: dbBattle.strongElement,
      weakElement: dbBattle.weakElement
    })
  }
}

export type DBBattleToCreate = Omit<DBBattle, 'id' | 'characters'>
export type DBBattleToUpdate = Pick<
  DBBattle,
  'strongElement' | 'weakElement' | 'alreadyActedCharacters' | 'updatedDate' | 'currentTurn' | 'isOver'
>
