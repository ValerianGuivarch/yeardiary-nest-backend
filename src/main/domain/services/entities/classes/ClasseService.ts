import { Classe, ClasseToCreate, ClasseToUpdate } from '../../../models/classes/Classe'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { IClasseProvider } from '../../../providers/classes/IClasseProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ClasseService {
  private readonly logger = new Logger(ClasseService.name)
  constructor(@Inject('IClasseProvider') private readonly classeProvider: IClasseProvider) {
    this.logger.log(ClasseService.name)
  }

  async create(classeToCreate: ClasseToCreate): Promise<Classe> {
    return await this.classeProvider.create(classeToCreate)
  }

  async getClasseById(id: string): Promise<Classe> {
    return await this.classeProvider.findOneById(id)
  }

  async getAllClassesPaginated(p: { pageOptions: PageOptions }): Promise<Page<Classe>> {
    return await this.classeProvider.findAllPaginated({ pageOptions: p.pageOptions })
  }

  async deleteOneClasse(classeId: string): Promise<void> {
    await this.classeProvider.deleteOneById(classeId)
  }

  async updateClasse(p: { id: string; classeToUpdate: ClasseToUpdate }): Promise<Classe> {
    return await this.classeProvider.update({
      id: p.id,
      classeToUpdate: p.classeToUpdate
    })
  }
}
