import { DBClasse, DBClasseToCreate, DBClasseToUpdate } from './DBClasse'
import { Classe, ClasseToCreate, ClasseToUpdate } from '../../../domain/models/classes/Classe'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { IClasseProvider } from '../../../domain/providers/classes/IClasseProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBClasseProvider implements IClasseProvider {
  constructor(
    @InjectRepository(DBClasse)
    private readonly classeRepository: Repository<DBClasse>
  ) {}

  async findOneById(id: string): Promise<Classe> {
    const res = await this.classeRepository.findOne({
      where: {
        id: id
      },
      relations: DBClasse.RELATIONS
    })
    if (!res) {
      throw ProviderErrors.EntityNotFound(DBClasse.name)
    }
    return DBClasse.toClasse(res)
  }

  async findAll(): Promise<Classe[]> {
    return (
      await this.classeRepository.find({
        relations: DBClasse.RELATIONS
      })
    ).map(DBClasse.toClasse)
  }

  async findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Classe>> {
    const [res, total] = await this.classeRepository.findAndCount({
      relations: DBClasse.RELATIONS,
      take: p.pageOptions.perPage,
      skip: p.pageOptions.skip
    })
    return new Page<Classe>({
      items: res.map(DBClasse.toClasse),
      pageOptions: p.pageOptions,
      total: total
    })
  }

  async create(classeToCreate: ClasseToCreate): Promise<Classe> {
    const toCreate: DBClasseToCreate = {
      name: classeToCreate.name,
      createdDate: new Date(),
      updatedDate: new Date()
    }
    const created = this.classeRepository.create(toCreate)
    await this.classeRepository.insert(created)
    return this.findOneById(created.id)
  }

  async update(p: { id: string; classeToUpdate: ClasseToUpdate }): Promise<Classe> {
    const toUpdate: DBClasseToUpdate = {
      name: p.classeToUpdate.name,
      updatedDate: new Date()
    }
    await this.classeRepository.update(
      {
        id: p.id
      },
      toUpdate
    )
    return await this.findOneById(p.id)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.classeRepository.delete({
      id: id
    })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBClasse.name)
    }
  }
}
