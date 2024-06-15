import config from '../../config/configuration'
import { ProviderErrors } from '../errors/ProviderErrors'
import { Injectable } from '@nestjs/common'
import { createClient } from '@prismicio/client'
import { Client } from '@prismicio/client/src/createClient'

@Injectable()
export class PrismicProvider {
  private client: Client

  constructor() {
    this.client = createClient(config().prismic.uri, {
      accessToken: config().prismic.accessToken
    })
  }

  async getSinglePage<T>(type: string): Promise<T> {
    try {
      const res = await this.client.getSingle(type)
      return res.data as T
    } catch (e) {
      throw ProviderErrors.EntityNotFound(type)
    }
  }

  async getPageById<T>(id: string): Promise<T> {
    try {
      const res = await this.client.getByID(id)
      return res.data as T
    } catch (e) {
      throw ProviderErrors.EntityNotFound(id)
    }
  }
}
