import { PrismicCityRaw } from './PrismicCityRaw'
import { City } from '../../../domain/models/cities/City'
import { ICityProvider } from '../../../domain/providers/cities/ICityProvider'
import { PrismicProvider } from '../PrismicProvider'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismicCityProvider implements ICityProvider {
  constructor(private readonly prismicProvider: PrismicProvider) {}

  async getCityById(id: string): Promise<City> {
    const rawData = await this.prismicProvider.getPageById<typeof PrismicCityRaw>(id)
    const data = PrismicCityRaw.parse(rawData)

    return new City({
      id: '',
      name: data.name.text,
      pointsOfInterest: []
    })
  }
}
