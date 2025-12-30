import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useLodgeService } from '@/services/lodge-services/lodge-services'
import { toast } from 'sonner'

export const lodgeQueryKeys = {
  all1: ['lodges'] as const,
  all: (type: string, keyword?: string, keyword1?: string, keyword2?: string) =>
    ['lodges', type, keyword, keyword1, keyword2] as const,
  byId: (id: string) => ['lodges', 'byId', id] as const,
}

export const useLodges = (keyword = '', keyword1 = '', keyword2 = '') => {
  const { search } = useLodgeService()

  return useQuery({
    queryKey: lodgeQueryKeys.all('lodge', keyword, keyword1, keyword2),
    queryFn: () => search('lodge', keyword, keyword1, keyword2),
    placeholderData: keepPreviousData,
  })
}

export const useCountries = (keyword = '', keyword1 = '', keyword2 = '') => {
  const { search } = useLodgeService()

  return useQuery({
    queryKey: lodgeQueryKeys.all('country', keyword),
    queryFn: () => search('country', keyword, keyword1, keyword2),
    placeholderData: keepPreviousData,
  })
}

export const useCity = (keyword = '', country = '', extra = '') => {
  const { search } = useLodgeService()

  return useQuery({
    queryKey: ['cities', keyword, country, extra],
    queryFn: () => search('city', keyword, country, extra),
    placeholderData: keepPreviousData,
  })
}

interface UseLodgeOptions {
  enabled?: boolean
}

export const useLodge = (id: string, options?: UseLodgeOptions) => {
  const { getById } = useLodgeService()

  const query = useQuery({
    queryKey: lodgeQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id && (options?.enabled ?? true), // default true if id exists
  })

  return {
    ...query,
    refetchLodge: query.refetch, // explicit alias for clarity
  }
}

export const useCreateLodge = () => {
  const { create } = useLodgeService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Lodge created successfully!')
      queryClient.invalidateQueries({ queryKey: lodgeQueryKeys.all1 })
    },
    onError: () => {
      toast.error('Failed to create lodge.')
    },
  })
}

export const useUpdateLodge = () => {
  const { update } = useLodgeService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Lodge updated successfully!')
      queryClient.invalidateQueries({ queryKey: lodgeQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: lodgeQueryKeys.all1 })
    },
    onError: () => {
      toast.error('Failed to update lodge.')
    },
  })
}

export const useDeleteLodge = () => {
  const { remove } = useLodgeService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Lodge deleted successfully!')
      queryClient.invalidateQueries({ queryKey: lodgeQueryKeys.all1 })
    },
    onError: () => {
      toast.error('Failed to delete lodge.')
    },
  })
}
