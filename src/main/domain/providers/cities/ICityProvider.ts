import { City } from '../../models/cities/City'

export interface ICityProvider {
  getCityById(id: string): Promise<City>
}
