import { MagicElement } from './MagicElement'
import { Skill } from './Skill'
import { SkillType } from './SkillType'

export const SKILL_MAGICAL_SPELL_LEVEL_MIN = 1
export const SKILL_MAGICAL_SPELL_LEVEL_MAX = 9

export class SkillMagical extends Skill {
  element: MagicElement
  spellLevel: number
  readonly type = SkillType.MAGICAL

  constructor(p: {
    id: string
    name: string
    description: string
    minimumLevel: number
    damage: number
    element: MagicElement
    spellLevel: number
  }) {
    super({
      id: p.id,
      name: p.name,
      description: p.description,
      minimumLevel: p.minimumLevel,
      damage: p.damage
    })
    this.element = p.element
    this.spellLevel = p.spellLevel
  }

  static toSkillMagicalToCreate(p: {
    name: string
    description: string
    minimumLevel: number
    damage: number
    element: MagicElement
    spellLevel: number
  }): SkillMagicalToCreate {
    return p
  }

  static isSkillMagical(skill: Skill): skill is SkillMagical {
    return skill.type === SkillType.MAGICAL
  }
}

export type SkillMagicalToCreate = Omit<SkillMagical, 'id' | 'type'>
export type SkillMagicalToUpdate = Pick<
  SkillMagical,
  'name' | 'description' | 'minimumLevel' | 'damage' | 'element' | 'spellLevel'
>
