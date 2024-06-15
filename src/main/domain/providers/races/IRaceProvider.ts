import { Race, RaceToCreate, RaceToUpdate } from '../../models/races/Race'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface IRaceProvider {
  create(race: RaceToCreate): Promise<Race>
  findOneById(id: string): Promise<Race>
  findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Race>>
  findAll(): Promise<Race[]>
  update(p: { raceId: string; race: Partial<RaceToUpdate> }): Promise<Race>
  deleteOneById(id: string): Promise<void>
}
