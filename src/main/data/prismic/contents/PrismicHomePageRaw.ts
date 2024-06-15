import { PrismicPictureZodRaw } from '../types/PrismicPictureZodRaw'
import { PrismicTextZodRaw } from '../types/PrismicTextZodRaw'
import { z } from 'zod'

export const PrismicHomePageRaw = z.object({
  title: z.array(PrismicTextZodRaw).transform((array) => array[0]),
  description: z.array(PrismicTextZodRaw).transform((array) => array[0]),
  picture: PrismicPictureZodRaw
})
