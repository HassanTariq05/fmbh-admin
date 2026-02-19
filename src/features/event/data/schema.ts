import { z } from 'zod'

export const eventSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().nullable().optional(),
  start_at: z
    .string()
    .datetime({ message: 'Start date must be a valid datetime' }),
  end_at: z.string().datetime({ message: 'End date must be a valid datetime' }),
  location: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
  lodge_id: z.number(),
  lodge_name: z.string().nullable().optional(),
  lodge_city: z.string().nullable().optional(),
  lodge_country: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Event = z.infer<typeof eventSchema>
