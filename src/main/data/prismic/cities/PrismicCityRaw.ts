import { PrismicTextZodRaw } from '../types/PrismicTextZodRaw'
import { z } from 'zod'

const PointOfInterestZodRaw = z.object({
  name1: z.string(),
  open: z.null().or(z.string()),
  description: z.array(PrismicTextZodRaw)
})

export const PrismicCityRaw = z.object({
  name: z.array(PrismicTextZodRaw).transform((array) => array[0]),
  points_of_interest: z.array(PointOfInterestZodRaw)
})
