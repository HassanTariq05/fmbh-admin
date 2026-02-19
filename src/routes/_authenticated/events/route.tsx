import { createFileRoute } from '@tanstack/react-router'
import { EventsView } from '@/features/event'

export const Route = createFileRoute('/_authenticated/events')({
  component: EventsView,
})
