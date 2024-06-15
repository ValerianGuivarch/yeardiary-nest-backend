import { SkillMagicalVM } from './SkillMagicalVM'
import { SkillPhysicalVM } from './SkillPhysicallVM'
import { SkillVM } from './SkillVM'
import { Skill } from '../../../../../../domain/models/skills/Skill'
import { SkillMagical } from '../../../../../../domain/models/skills/SkillMagical'
import { SkillPhysical } from '../../../../../../domain/models/skills/SkillPhysical'
import { HttpException, HttpStatus } from '@nestjs/common'

export class FactorySkillVM {
  static from(skill: Skill): SkillVM {
    if (SkillMagical.isSkillMagical(skill)) {
      return SkillMagicalVM.from(skill)
    } else if (SkillPhysical.isSkillPhysical(skill)) {
      return SkillPhysicalVM.from(skill)
    } else {
      throw new HttpException('Wrong skill type', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
