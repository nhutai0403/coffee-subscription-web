import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error - please check your connection'))
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      console.warn("Unauthorized - token expired or invalid")
    }
    return Promise.reject(error)
  }
)

const apiFormData = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  }
})

apiFormData.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api, apiFormData }
