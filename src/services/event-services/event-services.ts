import { useApiClient } from '@/lib/axios'
import { Event, CreateEventPayload, UpdateEventPayload } from './types'

export const useEventService = () => {
  const apiClient = useApiClient()

  const getAll = async (
    lodge?: string | number,
    status?: string,
    keyword?: string,
    country?: string | number,
    city?: string | number,
    page = 1,
    limit = 10
  ): Promise<{ data: Event[]; pagination: any }> => {
    const params: any = { page, limit }

    if (lodge) params.lodge = lodge
    if (status) params.status = status
    if (keyword) params.keyword = keyword
    if (country) params.country = country
    if (city) params.city = city

    const { data } = await apiClient.get('/events', { params })
    return data
  }

  const getById = async (id: string): Promise<Event> => {
    const { data } = await apiClient.get(`/events/${id}`)
    return data.data
  }

  const create = async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await apiClient.post('/events', payload)
    return data.data
  }

  const update = async (
    id: string,
    payload: UpdateEventPayload
  ): Promise<Event> => {
    const { data } = await apiClient.put(`/events/${id}`, payload)
    return data.data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`)
  }

  return { getAll, getById, create, update, remove }
}
