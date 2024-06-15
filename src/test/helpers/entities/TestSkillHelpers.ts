import { DBSkillMagical } from '../../../main/data/database/skills/DBSkillMagical'
import { DBSkillPhysical } from '../../../main/data/database/skills/DBSkillPhysical'
import { MagicElement } from '../../../main/domain/models/skills/MagicElement'
import { SkillMagical, SkillMagicalToCreate } from '../../../main/domain/models/skills/SkillMagical'
import { SkillPhysical, SkillPhysicalToCreate } from '../../../main/domain/models/skills/SkillPhysical'
import { SkillType } from '../../../main/domain/models/skills/SkillType'
import { WeaponType } from '../../../main/domain/models/skills/WeaponType'
import { Chance } from 'chance'

export class TestSkillHelpers {
  static chance = new Chance()

  static generateSkillMagicalToCreate(): SkillMagicalToCreate {
    return {
      damage: this.chance.integer({ min: 5, max: 50 }),
      description: this.chance.string(),
      element: MagicElement.WATER,
      minimumLevel: this.chance.integer({ min: 1, max: 20 }),
      spellLevel: this.chance.integer({ min: 1, max: 9 }),
      name: this.chance.string()
    }
  }

  static generateSkillPhysicalToCreate(): SkillPhysicalToCreate {
    return {
      damage: this.chance.integer({ min: 5, max: 50 }),
      description: this.chance.string(),
      minimumLevel: this.chance.integer({ min: 1, max: 20 }),
      weaponType: WeaponType.SWORD,
      name: this.chance.string()
    }
  }

  static generateSkillMagical(): SkillMagical {
    return {
      id: this.chance.guid(),
      type: SkillType.MAGICAL,
      damage: this.chance.integer({ min: 5, max: 50 }),
      description: this.chance.string(),
      element: MagicElement.WATER,
      minimumLevel: this.chance.integer({ min: 1, max: 20 }),
      spellLevel: this.chance.integer({ min: 1, max: 9 }),
      name: this.chance.string()
    }
  }

  static generateSkillPhysical(): SkillPhysical {
    return {
      id: this.chance.guid(),
      type: SkillType.PHYSICAL,
      damage: this.chance.integer({ min: 5, max: 50 }),
      description: this.chance.string(),
      minimumLevel: this.chance.integer({ min: 1, max: 20 }),
      weaponType: WeaponType.SWORD,
      name: this.chance.string()
    }
  }

  static generateDBSkillMagical(): DBSkillMagical {
    return {
      createdDate: this.chance.date(),
      updatedDate: this.chance.date(),
      id: this.chance.guid(),
      damage: this.chance.integer({ min: 5, max: 50 }),
      description: this.chance.string(),
      element: MagicElement.WATER,
      minimumLevel: this.chance.integer({ min: 1, max: 20 }),
      spellLevel: this.chance.integer({ min: 1, max: 9 }),
      name: this.chance.string()
    }
  }

  static generateDBSkillPhysical(): DBSkillPhysical {
    return {
      createdDate: this.chance.date(),
      updatedDate: this.chance.date(),
      id: this.chance.guid(),
      damage: this.chance.integer({ min: 5, max: 50 }),
      description: this.chance.string(),
      minimumLevel: this.chance.integer({ min: 1, max: 20 }),
      weaponType: WeaponType.SWORD,
      name: this.chance.string()
    }
  }
}
