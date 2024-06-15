import { JWTToken } from '../../../../../../domain/models/auth/JWTToken'
import { ApiProperty } from '@nestjs/swagger'

export class JWTTokenVM {
  @ApiProperty({
    description: 'The access token',
    type: String
  })
  accessToken: string

  @ApiProperty({
    description: 'The access token expiration',
    type: Number
  })
  accessTokenExpiration: number

  @ApiProperty({
    description: 'The refresh token',
    type: String
  })
  refreshToken: string

  @ApiProperty({
    description: 'The refresh token expiration',
    type: Number
  })
  refreshTokenExpiration: number

  constructor(p: JWTTokenVM) {
    this.accessToken = p.accessToken
    this.accessTokenExpiration = p.accessTokenExpiration
    this.refreshToken = p.refreshToken
    this.refreshTokenExpiration = p.refreshTokenExpiration
  }

  static from(jwtToken: JWTToken): JWTTokenVM {
    return new JWTTokenVM({
      accessToken: jwtToken.accessToken,
      accessTokenExpiration: jwtToken.accessTokenExpiration,
      refreshToken: jwtToken.refreshToken,
      refreshTokenExpiration: jwtToken.refreshTokenExpiration
    })
  }
}

export const JWTTokenVMExample: JWTTokenVM = {
  accessToken: 'accessToken',
  accessTokenExpiration: 1000,
  refreshToken: 'refreshToken',
  refreshTokenExpiration: 2000
}
