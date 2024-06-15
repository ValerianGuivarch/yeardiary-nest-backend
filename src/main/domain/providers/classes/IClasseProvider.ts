import { Classe, ClasseToCreate, ClasseToUpdate } from '../../models/classes/Classe'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface IClasseProvider {
  create(classeToCreate: ClasseToCreate): Promise<Classe>
  findOneById(id: string): Promise<Classe>
  findAll(): Promise<Classe[]>
  findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Classe>>
  update(p: { id: string; classeToUpdate: ClasseToUpdate }): Promise<Classe>
  deleteOneById(id: string): Promise<void>
}
