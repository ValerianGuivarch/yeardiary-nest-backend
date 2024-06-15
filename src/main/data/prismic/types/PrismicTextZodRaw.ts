import { z } from 'zod'

export const PrismicTextZodRaw = z.object({
  type: z.string(),
  text: z.string(),
  spans: z.array(z.any()),
  direction: z.string()
})
