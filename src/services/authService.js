import axios from 'axios'

// Use environment variable for API base URL, fallback to hardcoded URL
// In development, Vite proxy will handle CORS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  async signIn({ email, password }) {
    try {
      const response = await api.post('/Auth/login', {
        email,
        password,
      })
      
      if (response.data.success && response.data.data?.token) {
        // Extract user info from JWT token if needed
        // For now, we'll use the email as identifier
        const user = {
          email,
          // You might want to decode JWT to get user ID and other details
        }
        return { 
          token: response.data.data.token, 
          user 
        }
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Signin error details:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password')
      } else if (error.response?.status === 400) {
        throw new Error('Invalid login data. Please check your email and password.')
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.')
      } else if (error.response?.status === 404) {
        throw new Error('Login endpoint not found. Please contact administrator.')
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.')
      } else if (error.message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else if (error.response) {
        throw new Error(`Login failed with status ${error.response.status}`)
      } else {
        throw new Error(`Login failed: ${error.message}`)
      }
    }
  },

    async signUp({ name: _name, email: _email, password: _password }) {
    try {
      // Try different possible endpoints
      let response;
      try {
        console.log('Trying endpoint: /User/register');
        response = await api.post('/User/register', {
          email: _email,
          password: _password,
          username: _name,
          fullName: _name,
          phoneNumber: null,
          roleId: 0
        });
        console.log('First endpoint successful');
      } catch (firstError) {
        if (firstError.response?.status === 404) {
          // Try alternative endpoint
          console.log('First endpoint failed with 404, trying /Auth/register...');
          response = await api.post('/Auth/register', {
            email: _email,
            password: _password,
            username: _name,
            fullName: _name,
            phoneNumber: null,
            roleId: 0
          });
          console.log('Alternative endpoint successful');
        } else {
          throw firstError;
        }
      }
      
             console.log('Response data:', response.data);
       
       if (response.data.success) {
         // Check different response formats
         let token = null;
         
         if (response.data.data?.token) {
           // Format: { success: true, data: { token: "..." } }
           token = response.data.data.token;
         } else if (response.data.token) {
           // Format: { success: true, token: "..." }
           token = response.data.token;
         } else if (response.data.message === "User registered successfully") {
           // Format: { success: true, message: "User registered successfully" }
           // For this case, we need to login to get the token
           console.log('User registered successfully, attempting to login...');
           const loginResponse = await api.post('/Auth/login', {
             email: _email,
             password: _password
           });
           
           if (loginResponse.data.success && loginResponse.data.data?.token) {
             token = loginResponse.data.data.token;
           } else {
             throw new Error('User registered but login failed to get token');
           }
         }
         
         if (token) {
           const user = { 
             name: _name, 
             email: _email,
             username: _name
           }
           return { 
             token: token, 
             user 
           }
         } else {
           throw new Error('Sign up successful but no authentication token received. Please try logging in.');
         }
       } else {
         throw new Error('Sign up failed');
       }
    } catch (error) {
      console.error('Signup error details:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.status === 400) {
        throw new Error('Invalid signup data. Please check your information.')
      } else if (error.response?.status === 409) {
        throw new Error('Email already exists. Please use a different email.')
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.')
      } else if (error.response?.status === 404) {
        throw new Error('Signup endpoint not found. Please contact administrator.')
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.')
      } else if (error.message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.')
      } else if (error.response) {
        throw new Error(`Signup failed with status ${error.response.status}`)
      } else {
        throw new Error(`Signup failed: ${error.message}`)
      }
    }
  },

  async signInWithGoogle(googleToken) {
    try {
      const response = await api.post('/Auth/google-login', { token: googleToken })
      if (response.data.success && response.data.data?.token) {
        // Nếu backend trả về user info, lấy luôn, nếu không chỉ lấy token
        const user = response.data.data.user || { provider: 'google' }
        return {
          token: response.data.data.token,
          user
        }
      } else {
        throw new Error('Google login failed')
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Google login failed. Please try again.')
      }
    }
  },

  signOut() {
    // No-op for now. You might want to call a logout endpoint if your API has one
    return
  },
}


