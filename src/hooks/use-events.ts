import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useEventService } from '@/services/event-services/event-services'
import { toast } from 'sonner'
import { UpdateEventPayload } from '../services/event-services/types'

export const eventQueryKeys = {
  all: (
    lodge?: string,
    status?: string,
    keyword?: string,
    country?: string,
    city?: string
  ) => ['events', lodge, status, keyword, country, city] as const,
  byId: (id: string) => ['events', 'byId', id] as const,
}

export const useEvents = (
  keyword?: string,
  lodge?: string,
  status?: string,
  country?: string,
  city?: string
) => {
  const { getAll } = useEventService()

  return useQuery({
    queryKey: eventQueryKeys.all(lodge, status, keyword, country, city),
    queryFn: () => getAll(lodge, status, keyword, country, city),
    placeholderData: keepPreviousData,
  })
}

export const useEvent = (id: string) => {
  const { getById } = useEventService()
  return useQuery({
    queryKey: eventQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateEvent = () => {
  const { create } = useEventService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Event created successfully!')
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: () => toast.error('Failed to create event.'),
  })
}

export const useUpdateEvent = () => {
  const { update } = useEventService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateEventPayload
    }) => update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Event updated successfully!')
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: () => toast.error('Failed to update event.'),
  })
}

export const useDeleteEvent = () => {
  const { remove } = useEventService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Event deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: () => toast.error('Failed to delete event.'),
  })
}
