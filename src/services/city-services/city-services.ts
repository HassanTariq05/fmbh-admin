import { useApiClient } from '@/lib/axios'

export interface City {
  id: number
  name: string
  created_at: string
}

export interface CityGeneric {
  id: number
  name: string
  country?: string
  country_id?: number
}

export type CreateCityPayload = Omit<CityGeneric, 'id'>
export type UpdateCityPayload = Partial<CreateCityPayload>

export const useCityService = () => {
  const apiClient = useApiClient()

  const getAll = async (keyword?: string): Promise<City[]> => {
    const params = keyword && keyword.trim() !== '' ? { keyword } : {}

    const { data } = await apiClient.get('/city/getAll', { params })

    return data.data
  }

  const getById = async (id: string): Promise<City> => {
    const { data } = await apiClient.get(`/city/${id}`)
    return data.data
  }

  const create = async (payload: CreateCityPayload): Promise<City> => {
    const { data } = await apiClient.post('/city', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateCityPayload
  ): Promise<City> => {
    const { data } = await apiClient.put(`/city/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/city/${id}`)
  }

  return { getAll, getById, create, update, remove }
}
