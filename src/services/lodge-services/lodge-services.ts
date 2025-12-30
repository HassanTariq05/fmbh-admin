import { Page } from '@/types/generic/types'
import { useApiClient } from '@/lib/axios'

export interface Lodge {
  id: number
  title: string
  desc?: string
}

export interface LodgeGeneric {
  id: number
  lodge_name: string
  lodge_number: number
  meeting_time: string
  address: string
  city: string
  country: string
  latitude?: number
  longitude?: number
}

export type CreateLodgePayload = Omit<LodgeGeneric, 'id'>
export type UpdateLodgePayload = Partial<CreateLodgePayload>

export const useLodgeService = () => {
  const apiClient = useApiClient()

  const search = async (
    type: string,
    keyword: string,
    keyword1: string,
    keyword2: string
  ): Promise<Page<Lodge>> => {
    const { data } = await apiClient.get(
      `/search?type=${type}&keyword=${keyword}&keyword1=${keyword1}&keyword2=${keyword2}`
    )
    return data.data
  }

  const getById = async (id: string): Promise<LodgeGeneric> => {
    const { data } = await apiClient.get(`/lodge/${id}`)
    return data.data
  }

  const create = async (payload: CreateLodgePayload): Promise<Lodge> => {
    const { data } = await apiClient.post('/lodge', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateLodgePayload
  ): Promise<Lodge> => {
    const { data } = await apiClient.put(`/lodge/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/lodge/${id}`)
  }

  return { search, getById, create, update, remove }
}
