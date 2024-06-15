import { DBRace, DBRaceToCreate, DBRaceToUpdate } from './DBRace'
import { Race, RaceToCreate, RaceToUpdate } from '../../../domain/models/races/Race'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { IRaceProvider } from '../../../domain/providers/races/IRaceProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBRaceProvider implements IRaceProvider {
  constructor(
    @InjectRepository(DBRace)
    private readonly raceRepository: Repository<DBRace>
  ) {}

  async findOneById(id: string): Promise<Race> {
    const res = await this.raceRepository.findOne({
      where: {
        id: id
      },
      relations: DBRace.RELATIONS
    })
    if (!res) {
      throw ProviderErrors.EntityNotFound(DBRace.name)
    }
    return DBRace.toRace(res)
  }

  async create(raceToCreate: RaceToCreate): Promise<Race> {
    const toCreate: DBRaceToCreate = {
      name: raceToCreate.name,
      createdDate: new Date(),
      updatedDate: new Date(),
      sleep: raceToCreate.sleep,
      size: raceToCreate.size
    }
    const created = this.raceRepository.create(toCreate)
    await this.raceRepository.insert(created)
    return await this.findOneById(created.id)
  }

  async findAll(): Promise<Race[]> {
    const res = await this.raceRepository.find({
      where: {},
      relations: DBRace.RELATIONS
    })
    return res.map(DBRace.toRace)
  }

  async findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Race>> {
    const [res, total] = await this.raceRepository.findAndCount({
      where: {},
      relations: DBRace.RELATIONS,
      take: p.pageOptions.perPage,
      skip: p.pageOptions.skip
    })
    return new Page({
      items: res.map(DBRace.toRace),
      pageOptions: p.pageOptions,
      total: total
    })
  }

  async update(p: { raceId: string; race: Partial<RaceToUpdate> }): Promise<Race> {
    const toUpdate: Partial<DBRaceToUpdate> = {
      name: p.race.name,
      size: p.race.size,
      sleep: p.race.sleep,
      updatedDate: new Date()
    }
    await this.raceRepository.update(
      {
        id: p.raceId
      },
      toUpdate
    )
    return await this.findOneById(p.raceId)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.raceRepository.delete({
      id: id
    })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBRace.name)
    }
  }
}
