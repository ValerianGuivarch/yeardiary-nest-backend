import { CharacterBattle } from '../../../domain/models/battles/CharacterBattle'
import { DBBattle } from '../battles/DBBattle'
import { DBCharacter } from '../characters/DBCharacter'
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('CharacterBattle')
export class DBCharacterBattle {
  @CreateDateColumn({ default: () => 'NOW()' })
  createdDate: Date

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedDate: Date

  @PrimaryColumn({ type: 'uuid' })
  characterId: string

  @ManyToOne(() => DBCharacter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'characterId' })
  character: DBCharacter

  @PrimaryColumn({ type: 'uuid' })
  battleId: string

  @ManyToOne(() => DBBattle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'battleId' })
  battle: DBBattle

  static readonly RELATIONS = {
    character: { characterClasses: { classe: true }, race: true, guilds: { guild: true } }
  }

  static toCharacterBattle(dbCharacterBattle: DBCharacterBattle): CharacterBattle {
    return {
      character: DBCharacter.toCharacter(dbCharacterBattle.character)
    }
  }
}
export type DBCharacterBattleToCreate = Omit<DBCharacterBattle, 'character' | 'battle'>
export type DBCharacterBattleToUpdate = Pick<DBCharacterBattle, 'updatedDate'>
