import { createFileRoute } from '@tanstack/react-router'
import { CountriesView } from '@/features/countries'

export const Route = createFileRoute('/_authenticated/countries')({
  component: CountriesView,
})
