import { City } from '../../../models/cities/City'
import { ICityProvider } from '../../../providers/cities/ICityProvider'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name)
  constructor(@Inject('ICityProvider') private readonly cityProvider: ICityProvider) {
    this.logger.log('Initialised')
  }

  async getCityById(id: string): Promise<City> {
    return await this.cityProvider.getCityById(id)
  }
}
