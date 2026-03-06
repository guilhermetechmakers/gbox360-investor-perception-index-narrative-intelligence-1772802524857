import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '@/api/companies'

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (query: string) => [...companyKeys.lists(), query] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
}

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.lists(),
    queryFn: companiesApi.getAll,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companiesApi.getById(id),
    enabled: !!id,
  })
}

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: companyKeys.list(query),
    queryFn: () => companiesApi.search(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60,
  })
}
