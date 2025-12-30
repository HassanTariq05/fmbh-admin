import { createFileRoute } from '@tanstack/react-router'
import { LodgesView } from '@/features/lodge'

export const Route = createFileRoute('/_authenticated/lodges')({
  component: LodgesView,
})
