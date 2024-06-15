import { DBSkill } from './DBSkill'
import { DBSkillMagical, DBSkillMagicalToCreate, DBSkillMagicalToUpdate } from './DBSkillMagical'
import { DBSkillPhysical, DBSkillPhysicalToCreate, DBSkillPhysicalToUpdate } from './DBSkillPhysical'
import { Skill } from '../../../domain/models/skills/Skill'
import { SkillMagicalToCreate, SkillMagicalToUpdate } from '../../../domain/models/skills/SkillMagical'
import { SkillPhysicalToCreate, SkillPhysicalToUpdate } from '../../../domain/models/skills/SkillPhysical'
import { SkillType } from '../../../domain/models/skills/SkillType'
import { Page } from '../../../domain/models/utils/pages/Page'
import { PageOptions } from '../../../domain/models/utils/pages/PageOptions'
import { ISkillProvider } from '../../../domain/providers/skills/ISkillProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBSkillProvider implements ISkillProvider {
  private readonly logger = new Logger(DBSkillProvider.name)
  constructor(
    @InjectRepository(DBSkill) private readonly skillRepository: Repository<DBSkillMagical & DBSkillPhysical>,
    @InjectRepository(DBSkillMagical) private readonly skillMagicalRepository: Repository<DBSkillMagical>,
    @InjectRepository(DBSkillPhysical) private readonly skillPhysicalRepository: Repository<DBSkillPhysical>
  ) {
    this.logger.log('Active')
  }

  static toSkill(dbSkill: DBSkill): Skill {
    if (DBSkillMagical.isDBSkillMagical(dbSkill)) {
      return DBSkillMagical.toSkillMagical(dbSkill)
    } else if (DBSkillPhysical.isDBSkillPhysical(dbSkill)) {
      return DBSkillPhysical.toSkillPhysical(dbSkill)
    } else {
      throw ProviderErrors.wrongEnumType('SkillType')
    }
  }

  async createSkillMagical(skillMagicalToCreate: SkillMagicalToCreate): Promise<Skill> {
    const toCreate: DBSkillMagicalToCreate = {
      ...skillMagicalToCreate,
      createdDate: new Date(),
      type: SkillType.MAGICAL,
      updatedDate: new Date()
    }
    const created = this.skillMagicalRepository.create(toCreate)
    await this.skillMagicalRepository.insert(created)
    return this.findOneSkillById(created.id)
  }

  async createSkillPhysical(skillPhysicalToCreate: SkillPhysicalToCreate): Promise<Skill> {
    const toCreate: DBSkillPhysicalToCreate = {
      ...skillPhysicalToCreate,
      createdDate: new Date(),
      type: SkillType.PHYSICAL,
      updatedDate: new Date()
    }
    const created = this.skillPhysicalRepository.create(toCreate)
    await this.skillPhysicalRepository.insert(created)
    return this.findOneSkillById(created.id)
  }

  async findOneSkillById(id: string): Promise<Skill> {
    const res = await this.skillRepository.findOne({
      where: {
        id: id
      },
      relations: DBSkill.RELATIONS
    })
    if (!res) {
      throw ProviderErrors.EntityNotFound(DBSkillMagical.name)
    }
    return DBSkillProvider.toSkill(res)
  }

  async findAll(): Promise<Skill[]> {
    const res = await this.skillRepository.find({
      where: {},
      relations: DBSkill.RELATIONS
    })
    return res.map(DBSkillProvider.toSkill)
  }

  async findAllPaginated(p: { pageOptions: PageOptions }): Promise<Page<Skill>> {
    const [res, total] = await this.skillRepository.findAndCount({
      where: {},
      relations: DBSkill.RELATIONS
    })
    return new Page({ items: res.map(DBSkillProvider.toSkill), pageOptions: p.pageOptions, total: total })
  }

  async updateSkillMagical(p: {
    skillId: string
    skillMagicalToUpdate: Partial<SkillMagicalToUpdate>
  }): Promise<Skill> {
    const toUpdate: Partial<DBSkillMagicalToUpdate> = {
      damage: p.skillMagicalToUpdate.damage,
      description: p.skillMagicalToUpdate.description,
      element: p.skillMagicalToUpdate.element,
      minimumLevel: p.skillMagicalToUpdate.minimumLevel,
      name: p.skillMagicalToUpdate.name,
      spellLevel: p.skillMagicalToUpdate.spellLevel,
      updatedDate: new Date()
    }
    await this.skillMagicalRepository.update(
      {
        id: p.skillId
      },
      toUpdate
    )
    return this.findOneSkillById(p.skillId)
  }

  async updateSkillPhysical(p: {
    skillId: string
    skillPhysicalToUpdate: Partial<SkillPhysicalToUpdate>
  }): Promise<Skill> {
    const toUpdate: Partial<DBSkillPhysicalToUpdate> = {
      damage: p.skillPhysicalToUpdate.damage,
      description: p.skillPhysicalToUpdate.description,
      minimumLevel: p.skillPhysicalToUpdate.minimumLevel,
      name: p.skillPhysicalToUpdate.name,
      updatedDate: new Date(),
      weaponType: p.skillPhysicalToUpdate.weaponType
    }
    await this.skillPhysicalRepository.update(
      {
        id: p.skillId
      },
      toUpdate
    )
    return this.findOneSkillById(p.skillId)
  }

  async deleteOneById(id: string): Promise<void> {
    const res = await this.skillRepository.delete({
      id: id
    })
    if (!res.affected) {
      throw ProviderErrors.EntityNotFound(DBSkill.name)
    }
  }
}
