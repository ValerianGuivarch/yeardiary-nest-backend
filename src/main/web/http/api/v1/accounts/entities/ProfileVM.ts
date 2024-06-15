import { Profile } from '../../../../../../domain/models/accounts/Account'
import { ApiProperty } from '@nestjs/swagger'

export class ProfileVM {
  @ApiProperty({ description: 'The account firstname', type: String })
  firstname: string

  @ApiProperty({ description: 'The account lastname', type: String })
  lastname: string

  private constructor(p: ProfileVM) {
    this.firstname = p.firstname
    this.lastname = p.lastname
  }

  static from(profile: Profile): ProfileVM {
    return new ProfileVM({
      firstname: profile.firstname,
      lastname: profile.lastname
    })
  }
}

export const ProfileVMExample: ProfileVM = {
  firstname: 'John',
  lastname: 'Doe'
}
