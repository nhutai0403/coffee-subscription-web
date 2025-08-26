import { api } from '../utils/axiosConfig'

export const timeWindowService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/SubscriptionTimeWindow')
      return response.data?.data || response.data
    } catch (error) {
      console.error('Error fetching time windows:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch time windows')
    }
  },

  create: async (windowData) => {
    try {
      const response = await api.post('/api/SubscriptionTimeWindow', windowData)
      return response.data
    } catch (error) {
      console.error('Error creating time window:', error)
      throw new Error(error.response?.data?.message || 'Failed to create time window')
    }
  },

  update: async (id, windowData) => {
    try {
      const response = await api.put(`/api/SubscriptionTimeWindow/${id}`, windowData)
      return response.data
    } catch (error) {
      console.error('Error updating time window:', error)
      throw new Error(error.response?.data?.message || 'Failed to update time window')
    }
  },

  remove: async (id) => {
    try {
      const response = await api.delete(`/api/SubscriptionTimeWindow/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting time window:', error)
      throw new Error(error.response?.data?.message || 'Failed to delete time window')
    }
  }
}
