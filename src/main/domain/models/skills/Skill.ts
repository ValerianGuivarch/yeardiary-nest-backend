import { SkillType } from './SkillType'

export const SKILL_MIN_LEVEL = 1

export abstract class Skill {
  id: string
  name: string
  description: string
  damage: number
  minimumLevel: number
  abstract type: SkillType

  protected constructor(p: { id: string; name: string; description: string; damage: number; minimumLevel: number }) {
    this.id = p.id
    this.name = p.name
    this.description = p.description
    this.damage = p.damage
    this.minimumLevel = p.minimumLevel
  }
}
