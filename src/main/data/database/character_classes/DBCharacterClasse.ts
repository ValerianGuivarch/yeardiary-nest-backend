import { CharacterClasse } from '../../../domain/models/characters/CharacterClasse'
import { DBCharacter } from '../characters/DBCharacter'
import { DBClasse } from '../classes/DBClasse'
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm'

@Entity('CharacterClasse')
export class DBCharacterClasse {
  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @Column({ type: 'integer', default: 1 })
  level: number

  @PrimaryColumn({ type: 'uuid' })
  characterId: string

  @ManyToOne(() => DBCharacter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'characterId' })
  character: DBCharacter

  @PrimaryColumn({ type: 'uuid' })
  classeId: string

  @ManyToOne(() => DBClasse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classeId' })
  classe: DBClasse

  static readonly RELATIONS = {}

  static toCharacterClasse(dbCharacterClasse: DBCharacterClasse): CharacterClasse {
    return {
      classe: DBClasse.toClasse(dbCharacterClasse.classe),
      level: dbCharacterClasse.level
    }
  }
}

export type DBCharacterClasseToCreate = Omit<DBCharacterClasse, 'createdDate' | 'updatedDate' | 'character' | 'classe'>
export type DBCharacterClasseToUpdate = Pick<DBCharacterClasse, 'level' | 'updatedDate'>
