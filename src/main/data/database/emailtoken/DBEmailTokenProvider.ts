import { DBEmailToken } from './DBEmailToken'
import { EmailToken, EmailTokenToCreate } from '../../../domain/models/auth/EmailToken'
import { IEmailTokenProvider } from '../../../domain/providers/email/IEmailTokenProvider'
import { ProviderErrors } from '../../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DBEmailTokenProvider implements IEmailTokenProvider {
  private readonly logger = new Logger(DBEmailTokenProvider.name)
  constructor(
    @InjectRepository(DBEmailToken)
    private readonly emailTokenRepository: Repository<DBEmailToken>
  ) {
    this.logger.log('DBEmailTokenProvider')
  }

  async create(emailTokenToCreate: EmailTokenToCreate): Promise<EmailToken> {
    await this.emailTokenRepository.delete({
      accountId: emailTokenToCreate.accountId
    })
    const emailToken = await this.emailTokenRepository.create(emailTokenToCreate)
    await this.emailTokenRepository.save(emailToken)
    return DBEmailToken.toEmailToken(emailToken)
  }

  async findOneByAccountId(accountId: string): Promise<EmailToken> {
    const dbEmailToken = await this.emailTokenRepository.findOneBy({ accountId: accountId })
    if (!dbEmailToken) {
      throw ProviderErrors.ExpiredTokenEmail()
    }
    return DBEmailToken.toEmailToken(dbEmailToken)
  }

  async findByAccountId(accountId: string): Promise<EmailToken | undefined> {
    const dbEmailToken = await this.emailTokenRepository.findOneBy({ accountId: accountId })
    if (dbEmailToken) {
      return DBEmailToken.toEmailToken(dbEmailToken)
    }
    return undefined
  }

  async deleteByAccountId(accountId: string): Promise<void> {
    await this.emailTokenRepository.delete({ accountId: accountId })
  }
}
