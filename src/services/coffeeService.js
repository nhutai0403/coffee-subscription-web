import { api, apiFormData } from '../utils/axiosConfig'

export const coffeeService = {
  // Get all coffee items
  getAllCoffeeItems: async () => {
    try {
      const response = await api.get('/api/CoffeeItem')
      return response.data?.data || []
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

  // Search coffee items with pagination
  searchCoffeeItems: async (searchCondition, pageInfo) => {
    try {
      const response = await api.post('/api/CoffeeItem/search', {
        searchCondition,
        pageInfo
      })
      return response.data?.data || { pageData: [], pageInfo: {} }
    } catch (error) {
      console.error('Error searching coffee items:', error)
      throw new Error('Failed to search coffee items.')
    }
  },

  // Create a new coffee item
  createCoffeeItem: async (coffeeData) => {
    try {
      // Debug: Log the data being sent
      console.log('Creating coffee item with data:', coffeeData)
      
      // Use FormData - let browser set Content-Type automatically
      const formData = new FormData()
      formData.append('CategoryId', coffeeData.categoryId)
      formData.append('CoffeeName', coffeeData.coffeeName)
      formData.append('Description', coffeeData.description || '')
      formData.append('Code', coffeeData.code)
      formData.append('IsActive', coffeeData.isActive)
      
      // If there's an image file, append it directly
      if (coffeeData.image) {
        formData.append('Image', coffeeData.image)
      }

      console.log('Sending FormData request')
      // Use regular api but override Content-Type to let browser set it
      const response = await api.post('/api/CoffeeItem', formData, {
        headers: {
          'Content-Type': undefined // Let browser set multipart/form-data with boundary
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating coffee item:', error)
      console.error('Error response:', error.response?.data)
      
      // Provide more detailed error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        throw new Error(`Validation errors: ${errorMessages.join(', ')}`)
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please check if all required fields are provided correctly.')
      } else {
        throw new Error('Failed to create coffee item.')
      }
    }
  },

  // Update existing coffee item
  updateCoffeeItem: async (coffeeId, coffeeData) => {
    try {
      console.log('Updating coffee item with data:', coffeeData)
      
      // Use FormData - let browser set Content-Type automatically
      const formData = new FormData()
      formData.append('CoffeeName', coffeeData.coffeeName || '')
      formData.append('Description', coffeeData.description || '')
      formData.append('Code', coffeeData.code || '')
      formData.append('IsActive', coffeeData.isActive)
      
      // Handle image file upload
      if (coffeeData.image) {
        formData.append('Image', coffeeData.image)
      }
      
      // Handle image URL if provided
      if (coffeeData.imageUrl) {
        formData.append('ImageUrl', coffeeData.imageUrl)
      }

      console.log('Sending FormData update request')
      const response = await api.put(`/api/CoffeeItem/${coffeeId}`, formData, {
        headers: {
          'Content-Type': undefined // Let browser set multipart/form-data with boundary
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating coffee item:', error)
      console.error('Error response:', error.response?.data)
      
      // Provide more detailed error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        throw new Error(`Validation errors: ${errorMessages.join(', ')}`)
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please check if all required fields are provided correctly.')
      } else {
        throw new Error('Failed to update coffee item.')
      }
    }
  },

  // Delete coffee item
  deleteCoffeeItem: async (coffeeId) => {
    try {
      const response = await api.delete(`/api/CoffeeItem/${coffeeId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting coffee item:', error)
      throw new Error('Failed to delete coffee item.')
    }
  },

  // Upload image file for coffee item
  uploadCoffeeImage: async (imageFile) => {
    try {
      const formData = new FormData()
      formData.append('File', imageFile)
      const response = await api.post('/api/CoffeeItem/image', formData, {
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
