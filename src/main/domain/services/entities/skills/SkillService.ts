import { Skill } from '../../../models/skills/Skill'
import { SkillMagicalToCreate, SkillMagicalToUpdate } from '../../../models/skills/SkillMagical'
import { SkillPhysicalToCreate, SkillPhysicalToUpdate } from '../../../models/skills/SkillPhysical'
import { Page } from '../../../models/utils/pages/Page'
import { PageOptions } from '../../../models/utils/pages/PageOptions'
import { ISkillProvider } from '../../../providers/skills/ISkillProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name)

  constructor(@Inject('ISkillProvider') private readonly skillProvider: ISkillProvider) {}

  async createSkillMagical(skillMagicalToCreate: SkillMagicalToCreate): Promise<Skill> {
    return this.skillProvider.createSkillMagical(skillMagicalToCreate)
  }

  async createSkillPhysical(skillPhysicalToCreate: SkillPhysicalToCreate): Promise<Skill> {
    return this.skillProvider.createSkillPhysical(skillPhysicalToCreate)
  }

  async getOneById(skillId: string): Promise<Skill> {
    return this.skillProvider.findOneSkillById(skillId)
  }

  async getAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Skill>> {
    return this.skillProvider.findAllPaginated({ pageOptions: p.pageOptions })
  }

  async updateSkillMagical(p: {
    skillId: string
    skillMagicalToUpdate: Partial<SkillMagicalToUpdate>
  }): Promise<Skill> {
    return this.skillProvider.updateSkillMagical({ skillId: p.skillId, skillMagicalToUpdate: p.skillMagicalToUpdate })
  }

  async updateSkillPhysical(p: {
    skillId: string
    skillPhysicalToUpdate: Partial<SkillPhysicalToUpdate>
  }): Promise<Skill> {
    return this.skillProvider.updateSkillPhysical({
      skillId: p.skillId,
      skillPhysicalToUpdate: p.skillPhysicalToUpdate
    })
  }

  async deleteOneSkill(id: string): Promise<void> {
    await this.skillProvider.deleteOneById(id)
  }
}
