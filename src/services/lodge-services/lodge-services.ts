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

  const uploadCsv = async (
    file: File
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await apiClient.post('/lodge/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

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

  const downloadCsv = async (): Promise<void> => {
    const response = await apiClient.get('/lodge/download-csv', {
      responseType: 'blob', // VERY IMPORTANT
    })

    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'lodges.csv')
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return { search, getById, create, update, remove, uploadCsv, downloadCsv }
}
