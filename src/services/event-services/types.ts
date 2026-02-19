export interface Event {
  id: number
  title: string
  description: string | null
  start_at: string
  end_at: string
  location: string | null
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  lodge_id: number
  lodge_name: string
  lodge_city: string
  lodge_country: string

  created_at: string
  updated_at: string
}

export interface CreateEventPayload {
  title: string
  description?: string | null
  start_at: string
  end_at: string
  location?: string | null
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  lodge_id: number | null
}

export type UpdateEventPayload = Partial<CreateEventPayload>

export interface CreateEventApiPayload {
  event_name?: string
  description?: string | null
  start_at: string
  end_at: string
  location?: string | null
  status?: string
  lodge_id: number
}
