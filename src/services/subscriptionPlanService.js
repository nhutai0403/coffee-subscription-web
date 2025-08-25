import { api } from '../utils/axiosConfig'

export const subscriptionPlanService = {
  getAllPlans: async () => {
    try {
      const response = await api.get('/api/SubscriptionPlan/getAll')
      return response.data
    } catch (error) {
      console.error('Error fetching subscription plans:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription plans')
    }
  },

  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/api/SubscriptionPlan/${planId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching subscription plan:', error)
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription plan')
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await api.post('/api/SubscriptionPlan/create', planData)
      return response.data
    } catch (error) {
      console.error('Error creating subscription plan:', error)
      throw new Error(error.response?.data?.message || 'Failed to create subscription plan')
    }
  },

  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/api/SubscriptionPlan/${planId}`, planData)
      return response.data
    } catch (error) {
      console.error('Error updating subscription plan:', error)
      throw new Error(error.response?.data?.message || 'Failed to update subscription plan')
    }
  },

  deletePlan: async (planId) => {
    try {
      const response = await api.delete(`/api/SubscriptionPlan/${planId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting subscription plan:', error)
      throw new Error(error.response?.data?.message || 'Failed to delete subscription plan')
    }
  }
}
