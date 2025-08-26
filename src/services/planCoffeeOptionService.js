import { api } from '../utils/axiosConfig'

export const planCoffeeOptionService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/PlanCoffeeOption')
      return response.data?.data || response.data
    } catch (error) {
      console.error('Error fetching plan coffee options:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to fetch plan coffee options'
      )
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/api/PlanCoffeeOption/${id}`)
      return response.data?.data || response.data
    } catch (error) {
      console.error('Error fetching plan coffee option:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to fetch plan coffee option'
      )
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/api/PlanCoffeeOption', data)
      return response.data
    } catch (error) {
      console.error('Error creating plan coffee option:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to create plan coffee option'
      )
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/api/PlanCoffeeOption/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating plan coffee option:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to update plan coffee option'
      )
    }
  },

  remove: async (id) => {
    try {
      const response = await api.delete(`/api/PlanCoffeeOption/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting plan coffee option:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to delete plan coffee option'
      )
    }
  }
}

