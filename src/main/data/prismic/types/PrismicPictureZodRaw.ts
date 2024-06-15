import { z } from 'zod'

const PrismicPictureDimensionZodRaw = z.object({
  width: z.number(),
  height: z.number()
})

const PrismicPictureEditZodRaw = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number(),
  background: z.string()
})

export const PrismicPictureZodRaw = z.object({
  dimensions: PrismicPictureDimensionZodRaw,
  alt: z.string(),
  copyright: z.null().or(z.string()), // pour gérer null et les chaînes
  url: z.string(),
  id: z.string(),
  edit: PrismicPictureEditZodRaw
})
