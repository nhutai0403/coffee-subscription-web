import { api } from '../utils/axiosConfig'

export const coffeeService = {
  getAllCoffeeItems: async () => {
    try {
      const response = await api.get('/api/CoffeeItem/getAll')
      return response.data
    } catch (error) {
      console.error('Error fetching coffee items:', error)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.')
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error('Failed to fetch coffee items. Please try again.')
      }
    }
  },

  getCoffeeItemById: async (coffeeId) => {
    try {
      const response = await api.get(`/api/CoffeeItem/${coffeeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching coffee item:', error)
      throw new Error('Failed to fetch coffee item details.')
    }
  },

  createCoffeeItem: async (coffeeData) => {
    try {
      // Log the data being sent for debugging
      console.log('Original coffee data:', coffeeData)
      // Ensure all fields are properly formatted to match API schema
      const formattedData = {
        categoryId: parseInt(coffeeData.categoryId) || 1,  // Default to category 1 if not provided
        coffeeName: coffeeData.coffeeName || "",
        description: coffeeData.description || "",
        code: coffeeData.code || "",
        isActive: coffeeData.isActive !== undefined ? coffeeData.isActive : true,
        image: coffeeData.imageUrl || ""  // API expects 'image' not 'imageUrl'
      }
      console.log('Formatted data for API:', formattedData)
      console.log('Data types:', {
        categoryId: typeof formattedData.categoryId,
        coffeeName: typeof formattedData.coffeeName,
        description: typeof formattedData.description,
        code: typeof formattedData.code,
        isActive: typeof formattedData.isActive,
        image: typeof formattedData.image
      })
      // Try with JSON first
      try {
        const response = await api.post('/api/CoffeeItem/create', formattedData)
        return response.data
      } catch (jsonError) {
        // If JSON fails with 415, try with form data
        if (jsonError.response?.status === 415) {
          console.log('JSON failed with 415, trying form data...')
          const formData = new FormData()
          Object.keys(formattedData).forEach(key => {
            if (formattedData[key] !== null && formattedData[key] !== undefined) {
              formData.append(key, formattedData[key])
            }
          })
          const formResponse = await api.post('/api/CoffeeItem/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          return formResponse.data
        } else {
          throw jsonError
        }
      }
    } catch (error) {
      console.error('Error creating coffee item:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      if (error.response?.status === 415) {
        throw new Error('Server cannot process the data format. Please check your input and try again.')
      } else if (error.response?.status === 400) {
        // Handle validation errors with detailed information
        if (error.response.data?.errors) {
          const validationErrors = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n')
          throw new Error(`Validation errors:\n${validationErrors}`)
        } else if (error.response.data?.title) {
          throw new Error(error.response.data.title)
        } else {
          throw new Error('Invalid coffee item data. Please check your input.')
        }
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.status === 409) {
        throw new Error('Coffee item with this code already exists.')
      } else {
        throw new Error(`Failed to create coffee item. Status: ${error.response?.status || 'Unknown'}`)
      }
    }
  },

  updateCoffeeItem: async (coffeeId, coffeeData) => {
    try {
      const response = await api.put(`/api/CoffeeItem/${coffeeId}`, coffeeData)
      return response.data
    } catch (error) {
      console.error('Error updating coffee item:', error)
      throw new Error('Failed to update coffee item.')
    }
  },

  deleteCoffeeItem: async (coffeeId) => {
    try {
      const response = await api.delete(`/api/CoffeeItem/${coffeeId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting coffee item:', error)
      throw new Error('Failed to delete coffee item.')
    }
  },

  uploadCoffeeImage: async (imageFile) => {
    try {
      const formData = new FormData()
      formData.append('File', imageFile)
      const response = await api.post('/api/CoffeeItem/Image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading coffee image:', error)
      throw new Error(error.response?.data?.message || 'Failed to upload image')
    }
  }
}

