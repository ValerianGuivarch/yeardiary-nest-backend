import { Authority } from '../../../../domain/models/accounts/Authority'
import { AuthenticationWorkflowService } from '../../../../domain/services/workflows/auth/AuthenticationWorkflowService'
import { IS_PUBLIC_KEY } from '../decorators/PublicDecorator'
import { ROLES_KEY } from '../decorators/RolesDecorator'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly jwtSecret: string
  constructor(
    private jwtService: JwtService,
    private authenticationService: AuthenticationWorkflowService,
    private reflector: Reflector,
    private readonly configService: ConfigService
  ) {
    const jwtSecret = configService.get<string>('JwtService.jwtSecret')
    if (!jwtSecret) {
      throw new Error('JwtService.jwtSecret is not defined')
    }
    this.jwtSecret = jwtSecret
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Authority[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    const request = context.switchToHttp().getRequest()
    const token = RolesGuard.extractTokenFromHeader(request)
    if (!token) {
      if (isPublic) {
        return true
      }
      throw new UnauthorizedException()
    }
    try {
      request.account = await this.authenticationService.getConnectedAccount(token)
      if (isPublic) {
        return true
      }
      return requiredRoles.some((role) => request.account.authority === role)
    } catch {
      throw new ForbiddenException()
    }
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
