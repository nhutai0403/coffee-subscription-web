import { useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    setIsInitializing(false)
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      const { token: newToken, user: authedUser } = await authService.signIn({ email, password })
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(authedUser))
      setToken(newToken)
      setUser(authedUser)
      return authedUser
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }, [])


  const signUp = useCallback(async (name, email, password) => {
    try {
      const { token: newToken, user: newUser } = await authService.signUp({ name, email, password })
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }, [])

  const signOut = useCallback(() => {
    try {
      authService.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      setToken(null)
      setUser(null)
    }
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    isInitializing,
    isAuthenticated: Boolean(user && token),
    signIn,
    signUp,
    signOut,
  }), [user, token, isInitializing, signIn, signUp, signOut])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
