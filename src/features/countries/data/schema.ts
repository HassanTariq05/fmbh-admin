import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const countrySchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
  // .string()
  // .transform((val) => val.trim()) // remove spaces
  // .refine((val) => ['active', 'inactive'].includes(val.toLowerCase()), {
  //   message: 'Please select a valid status.',
  // })
  // .transform(
  //   (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  // ),
})

export type Country = z.infer<typeof countrySchema>
