import { api } from '@/lib/api'
import type { User, UpdateUserInput } from '@/types/user'

export const usersApi = {
  getCurrent: async (): Promise<User> => api.get<User>('/users/me'),
  updateProfile: async (updates: UpdateUserInput): Promise<User> =>
    api.put<User>(`/users/${updates.id}`, updates),
  getAll: async (): Promise<User[]> => api.get<User[]>('/users'),
  getById: async (id: string): Promise<User> =>
    api.get<User>(`/users/${id}`),
}
