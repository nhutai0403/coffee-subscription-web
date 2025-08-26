import { api } from '../utils/axiosConfig'

export const dailyCupTrackingService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/DailyCupTracking')
      return response.data?.data || response.data
    } catch (error) {
      console.error('Error fetching daily cup tracking:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch daily cup tracking')
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/api/DailyCupTracking', data)
      return response.data
    } catch (error) {
      console.error('Error creating daily cup tracking:', error)
      throw new Error(error.response?.data?.message || 'Failed to create daily cup tracking')
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/api/DailyCupTracking/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating daily cup tracking:', error)
      throw new Error(error.response?.data?.message || 'Failed to update daily cup tracking')
    }
  },

  remove: async (id) => {
    try {
      const response = await api.delete(`/api/DailyCupTracking/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting daily cup tracking:', error)
      throw new Error(error.response?.data?.message || 'Failed to delete daily cup tracking')
    }
  }
}
