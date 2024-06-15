import { Skill } from '../../models/skills/Skill'
import { SkillMagicalToCreate, SkillMagicalToUpdate } from '../../models/skills/SkillMagical'
import { SkillPhysicalToCreate, SkillPhysicalToUpdate } from '../../models/skills/SkillPhysical'
import { Page } from '../../models/utils/pages/Page'
import { PageOptions } from '../../models/utils/pages/PageOptions'

export interface ISkillProvider {
  createSkillMagical(skillMagicalToCreate: SkillMagicalToCreate): Promise<Skill>

  createSkillPhysical(skillPhysicalToCreate: SkillPhysicalToCreate): Promise<Skill>

  findOneSkillById(id: string): Promise<Skill>

  findAll(): Promise<Skill[]>

  findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Skill>>

  updateSkillMagical(p: { skillId: string; skillMagicalToUpdate: Partial<SkillMagicalToUpdate> }): Promise<Skill>

  updateSkillPhysical(p: { skillId: string; skillPhysicalToUpdate: Partial<SkillPhysicalToUpdate> }): Promise<Skill>

  deleteOneById(id: string): Promise<void>
}
