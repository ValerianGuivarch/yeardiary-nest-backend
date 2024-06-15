import { Classe } from '../classes/Classe'

export type CharacterClasse = {
  classe: Classe
  level: number
}
export type CharacterClasseToCreate = Omit<CharacterClasse, 'classe'> & {
  classe: Pick<Classe, 'id'>
}
export type CharacterClasseToUpdate = Pick<CharacterClasse, 'level'>
