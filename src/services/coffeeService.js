import { api } from '../utils/axiosConfig'

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
      const requestData = {
        CategoryId: coffeeData.categoryId,
        CoffeeName: coffeeData.coffeeName,
        Description: coffeeData.description,
        Code: coffeeData.code,
        IsActive: coffeeData.isActive,
        Image: coffeeData.image
      }
      const response = await api.post('/api/CoffeeItem', requestData)
      return response.data
    } catch (error) {
      console.error('Error creating coffee item:', error)
      throw new Error(error.response?.data?.message || 'Failed to create coffee item.')
    }
  },

  // Update existing coffee item
  updateCoffeeItem: async (coffeeId, coffeeData) => {
    try {
      const requestData = {
        CoffeeName: coffeeData.coffeeName,
        Description: coffeeData.description,
        Code: coffeeData.code,
        IsActive: coffeeData.isActive,
        Image: coffeeData.image,
        ImageUrl: coffeeData.imageUrl
      }
      const response = await api.put(`/api/CoffeeItem/${coffeeId}`, requestData)
      return response.data
    } catch (error) {
      console.error('Error updating coffee item:', error)
      throw new Error('Failed to update coffee item.')
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

