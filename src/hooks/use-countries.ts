import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useCountryService } from '@/services/country-services/country-services'
import { toast } from 'sonner'

export const countryQueryKeys = {
  all: ['countries'] as const,
  byId: (id: string) => ['countries', id] as const,
}

export const useCountries = (keyword = '') => {
  const { getAll } = useCountryService()

  return useQuery({
    queryKey: countryQueryKeys.all,
    queryFn: () => getAll(keyword),
    placeholderData: keepPreviousData,
    enabled: false,
  })
}

interface UseCountryOptions {
  enabled?: boolean
}

export const useCountry = (id: string, options?: UseCountryOptions) => {
  const { getById } = useCountryService()

  const query = useQuery({
    queryKey: countryQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id && (options?.enabled ?? true),
  })

  return {
    ...query,
    refetchCountry: query.refetch,
  }
}

export const useCreateCountry = () => {
  const { create } = useCountryService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Country created successfully!')
      queryClient.invalidateQueries({ queryKey: countryQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create country.')
    },
  })
}

export const useUpdateCountry = () => {
  const { update } = useCountryService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Country updated successfully!')
      queryClient.invalidateQueries({ queryKey: countryQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: countryQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update country.')
    },
  })
}

export const useDeleteCountry = () => {
  const { remove } = useCountryService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Country deleted successfully!')
      queryClient.invalidateQueries({ queryKey: countryQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete country.')
    },
  })
}
