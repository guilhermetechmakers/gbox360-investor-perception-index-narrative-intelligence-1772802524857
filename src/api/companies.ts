import { api } from '@/lib/api'
import type { Company } from '@/types/company'

export const companiesApi = {
  getAll: async (): Promise<Company[]> => api.get<Company[]>('/companies'),
  getById: async (id: string): Promise<Company> =>
    api.get<Company>(`/companies/${id}`),
  search: async (query: string): Promise<Company[]> =>
    api.get<Company[]>(`/companies/search?q=${encodeURIComponent(query)}`),
}
