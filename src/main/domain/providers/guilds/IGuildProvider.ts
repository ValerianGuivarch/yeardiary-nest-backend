import { Guild, GuildToCreate, GuildToUpdate } from '../../models/guilds/Guild'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface IGuildProvider {
  create(guild: GuildToCreate): Promise<Guild>
  findOneById(id: string): Promise<Guild>
  findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Guild>>
  update(p: { guildId: string; guild: Partial<GuildToUpdate> }): Promise<Guild>
  deleteOneById(id: string): Promise<void>
}
