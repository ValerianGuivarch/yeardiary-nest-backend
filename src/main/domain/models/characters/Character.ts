import { CharacterClasse, CharacterClasseToCreate } from './CharacterClasse'
import { Account } from '../accounts/Account'
import { GuildMember } from '../guilds/GuildMember'
import { Race } from '../races/Race'
import { LinkedObject } from '../utils/LinkedObject'

export const CHARACTER_NAME_MIN_LENGTH = 3

export class Character {
  id: string
  linkedAccount: LinkedObject<Account>
  name: string
  level: number
  classes: CharacterClasse[]
  linkedInvoker?: LinkedObject<Character>
  race: Race
  guilds: GuildMemberWithoutMember[]
  picture?: string
  damageTaken: number
  get totalLife(): number {
    // eslint-disable-next-line no-magic-numbers
    return this.level * 8
  }
  get currentLevel(): number {
    return this.classes.reduce((accumulator, classe) => {
      return accumulator + classe.level
    }, 0)
  }
  get currentHp(): number {
    return this.totalLife - this.damageTaken
  }

  constructor(character: {
    id: string
    accountId: string
    name: string
    level: number
    classes: CharacterClasse[]
    invokerId?: string
    race: Race
    guilds: GuildMemberWithoutMember[]
    picture?: string
    damageTaken: number
  }) {
    this.id = character.id
    this.linkedAccount = {
      id: character.accountId
    }
    this.name = character.name
    this.level = character.level
    this.classes = character.classes
    this.linkedInvoker = character.invokerId
      ? {
          id: character.invokerId
        }
      : undefined
    this.race = character.race
    this.guilds = character.guilds
    this.picture = character.picture
    this.damageTaken = character.damageTaken
  }

  static toCharacterToCreate(p: {
    accountId: string
    name: string
    level: number
    invokerId?: string
    raceId: string
    classes: CharacterClasseToCreate[]
  }): CharacterToCreate {
    return {
      linkedAccount: {
        id: p.accountId
      },
      name: p.name,
      level: p.level,
      linkedInvoker: p.invokerId ? { id: p.invokerId } : undefined,
      race: {
        id: p.raceId
      },
      guilds: [],
      classes: p.classes,
      picture: undefined,
      damageTaken: 0
    }
  }
}

export type CharacterToCreate = Omit<
  Character,
  'id' | 'classes' | 'race' | 'currentLevel' | 'totalLife' | 'currentHp'
> & {
  race: Pick<Race, 'id'>
  classes: CharacterClasseToCreate[]
}
export type CharacterToUpdate = Pick<Character, 'name' | 'level' | 'picture' | 'damageTaken'>

export type GuildMemberWithoutMember = Omit<GuildMember, 'member'>
