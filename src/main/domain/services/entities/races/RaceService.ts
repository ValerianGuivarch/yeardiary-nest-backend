import { Race, RaceToCreate, RaceToUpdate } from '../../../models/races/Race'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { IRaceProvider } from '../../../providers/races/IRaceProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class RaceService {
  private readonly logger = new Logger(RaceService.name)
  constructor(@Inject('IRaceProvider') private readonly raceProvider: IRaceProvider) {}

  async createRace(raceToCreate: RaceToCreate): Promise<Race> {
    return await this.raceProvider.create(raceToCreate)
  }

  async getOneRaceById(id: string): Promise<Race> {
    return await this.raceProvider.findOneById(id)
  }

  async getAllRacesPaginated(p: { pageOptions: PageOptions }): Promise<Page<Race>> {
    return await this.raceProvider.findAllPaginated({ pageOptions: p.pageOptions })
  }

  async updateRace(p: { raceId: string; raceToUpdate: Partial<RaceToUpdate> }): Promise<Race> {
    return await this.raceProvider.update({ raceId: p.raceId, race: p.raceToUpdate })
  }

  async deleteOneRace(id: string): Promise<void> {
    await this.raceProvider.deleteOneById(id)
  }
}
