import { api } from '../utils/axiosConfig'

const handleError = (error) => {
  console.error('API Error:', error)
  
  // Network or timeout errors
  if (!error.response) {
    throw new Error(error.message || 'Network connection error')
  }

  // API errors with response
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  }

  // HTTP status code errors
  switch (error.response?.status) {
    case 400:
      throw new Error('Invalid credentials')
    case 401:
      throw new Error('Unauthorized - please login again')
    case 404:
      throw new Error('Service not available')
    case 500:
      throw new Error('Server error - please try again later')
    default:
      throw new Error('Operation failed - please try again')
  }
}

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

  signUp: async ({ name, email, password }) => {
    try {
      const userData = {
        email,
        password,
        username: name,
        fullName: name,
        phoneNumber: null,
        roleId: 0
      }

      let response
      try {
        response = await api.post('/api/User/register', userData)
      } catch (firstError) {
        if (firstError.response?.status === 404) {
          response = await api.post('/api/Auth/register', userData)
        } else {
          throw firstError
        }
      }

      if (!response.data.success) {
        throw new Error('Registration failed')
      }

      let token = response.data.data?.token || response.data.token

      if (!token && response.data.message === "User registered successfully") {
        const loginResponse = await api.post('/Auth/login', { email, password })
        if (loginResponse.data.success && loginResponse.data.data?.token) {
          token = loginResponse.data.data.token
        }
      }

      if (!token) {
        throw new Error('Registration successful but unable to login')
      }

      return {
        token,
        user: { name, email, username: name }
      }
    } catch (error) {
      handleError(error)
    }
  },

  signInWithGoogle: async (googleToken) => {
    try {
      const response = await api.post('/api/Auth/google-login', { token: googleToken })
      if (!response.data.success || !response.data.data?.token) {
        throw new Error('Google login failed')
      }
      return {
        token: response.data.data.token,
        user: response.data.data.user || { provider: 'google' }
      }
    } catch (error) {
      handleError(error)
    }
  },

  signOut: () => {
    localStorage.removeItem('auth_token')
    return true
  }
}


