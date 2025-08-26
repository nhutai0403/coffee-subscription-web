import { api } from '../utils/axiosConfig'

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get('/api/User')
      return response.data.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users.')
    }
  },

  searchUsers: async (keyword, isDelete = false, pageNum = 0, pageSize = 10) => {
    try {
      const payload = {
        searchCondition: {
          keyword,
          isDelete
        },
        pageInfo: {
          pageNum,
          pageSize
        }
      }
      const response = await api.post('/api/User/search', payload)
      return response.data.data
    } catch (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search users.')
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/User/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user details.')
    }
  },

  setUserActive: async (id, active) => {
    try {
      await api.put(`/api/User/is-active/${id}?active=${active}`)
    } catch (error) {
      console.error('Error updating user status:', error)
      throw new Error('Failed to update user status.')
    }
  },

  createUser: async (payload) => {
    try {
      await api.post('/api/User', payload)
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user.')
    }
  }
}
