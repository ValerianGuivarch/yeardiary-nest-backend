import { DBClasse } from '../../../main/data/database/classes/DBClasse'
import { Classe, ClasseToCreate } from '../../../main/domain/models/classes/Classe'
import { Chance } from 'chance'

export class TestClasseHelpers {
  static chance = new Chance()

  static generateClasseToCreate(): ClasseToCreate {
    return {
      name: this.chance.string()
    }
  }

  static generateClasse(): Classe {
    return {
      skills: [],
      id: this.chance.guid(),
      name: this.chance.string()
    }
  }

  static generateDBClasse(): DBClasse {
    return {
      skills: [],
      createdDate: this.chance.date(),
      updatedDate: this.chance.date(),
      id: this.chance.guid(),
      name: this.chance.string()
    }
  }
}
