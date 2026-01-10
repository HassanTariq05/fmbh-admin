import { createFileRoute } from '@tanstack/react-router'
import { CitiesView } from '@/features/cities'

export const Route = createFileRoute('/_authenticated/cities')({
  component: CitiesView,
})
