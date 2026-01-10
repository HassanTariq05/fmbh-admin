import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useCityService } from '@/services/city-services/city-services'
import { toast } from 'sonner'

export const cityQueryKeys = {
  all: ['cities'] as const,
  byId: (id: string) => ['cities', id] as const,
}

export const useCities = (keyword = '') => {
  const { getAll } = useCityService()

  return useQuery({
    queryKey: cityQueryKeys.all,
    queryFn: () => getAll(keyword),
    placeholderData: keepPreviousData,
  })
}

interface UseCityOptions {
  enabled?: boolean
}

export const useCity = (id: string, options?: UseCityOptions) => {
  const { getById } = useCityService()

  const query = useQuery({
    queryKey: cityQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id && (options?.enabled ?? true),
  })

  return {
    ...query,
    refetchCity: query.refetch,
  }
}

export const useCreateCity = () => {
  const { create } = useCityService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('City created successfully!')
      queryClient.invalidateQueries({ queryKey: cityQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create city.')
    },
  })
}

export const useUpdateCity = () => {
  const { update } = useCityService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('City updated successfully!')
      queryClient.invalidateQueries({ queryKey: cityQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: cityQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update city.')
    },
  })
}

export const useDeleteCity = () => {
  const { remove } = useCityService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('City deleted successfully!')
      queryClient.invalidateQueries({ queryKey: cityQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete city.')
    },
  })
}
