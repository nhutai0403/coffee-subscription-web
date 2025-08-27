import { api } from '../utils/axiosConfig'

export const userSubscriptionService = {
  getSubscriptions: async () => {
    try {
      const response = await api.get('/api/UserSubscription')
      return response.data
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      throw new Error('Failed to fetch subscriptions.')
    }
  },

  getSubscriptionById: async (id) => {
    try {
      const response = await api.get(`/api/UserSubscription/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching subscription:', error)
      throw new Error('Failed to fetch subscription.')
    }
  },

  updateSubscription: async (id, payload) => {
    try {
      const response = await api.put(`/api/UserSubscription/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw new Error('Failed to update subscription.')
    }
  },

  deleteSubscription: async (id) => {
    try {
      await api.delete(`/api/UserSubscription/${id}`)
    } catch (error) {
      console.error('Error deleting subscription:', error)
      throw new Error('Failed to delete subscription.')
    }
  }
}
