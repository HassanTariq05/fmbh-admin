import { useApiClient } from '@/lib/axios'

export interface Country {
  id: number
  name: string
  created_at: string
}

export interface CountryGeneric {
  id: number
  name: string
}

export type CreateCountryPayload = Omit<CountryGeneric, 'id'>
export type UpdateCountryPayload = Partial<CreateCountryPayload>

export const useCountryService = () => {
  const apiClient = useApiClient()

  const getAll = async (keyword?: string): Promise<Country[]> => {
    const params = keyword && keyword.trim() !== '' ? { keyword } : {}

    const { data } = await apiClient.get('/country/getAll', { params })

    return data.data
  }

  const getById = async (id: string): Promise<Country> => {
    const { data } = await apiClient.get(`/country/${id}`)
    return data.data
  }

  const create = async (payload: CreateCountryPayload): Promise<Country> => {
    const { data } = await apiClient.post('/country', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateCountryPayload
  ): Promise<Country> => {
    const { data } = await apiClient.put(`/country/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/country/${id}`)
  }

  return { getAll, getById, create, update, remove }
}
