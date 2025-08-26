import { api } from '../utils/axiosConfig'

export const authService = {
  signIn: async ({ email, password }) => {
    try {
      const response = await api.post('/api/Auth/login', { 
        email, 
        password 
      })
      
      if (!response.data.success || !response.data.data?.token) {
        throw new Error('Login failed')
      }
      
      // Save token for later requests
      localStorage.setItem('auth_token', response.data.data.token)

      return {
        token: response.data.data.token,
        user: { email }
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  signOut: () => {
    localStorage.removeItem('auth_token')
    return true
  }
}


