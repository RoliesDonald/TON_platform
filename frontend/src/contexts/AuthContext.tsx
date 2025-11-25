"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

// User role types based on the TON platform
export type UserRole = "admin" | "manager" | "accountant" | "service_advisor" | "mechanic" | "driver"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  created_at?: string
  last_login?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  updateUserRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthSession()
  }, [])

  const checkAuthSession = async () => {
    try {
      setIsLoading(true)

      // In a real app, check localStorage or make API call to validate session
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Validate token with backend
        // const response = await fetch('/api/v1/auth/validate', {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
        // if (!response.ok) {
        //   throw new Error('Invalid token')
        // }
      } else {
        // No existing session - user needs to login
        setUser(null)
      }
    } catch (error) {
      console.error('Auth session check failed:', error)
      // Clear invalid session
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // In a real app, make API call to authenticate
      // const response = await fetch('/api/v1/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // const data = await response.json()

      // Mock login for development
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (email && password) {
        // Determine user role based on email (for demo purposes)
        let role: UserRole = "manager"
        if (email.includes("admin")) role = "admin"
        else if (email.includes("accountant")) role = "accountant"
        else if (email.includes("mechanic")) role = "mechanic"
        else if (email.includes("driver")) role = "driver"
        else if (email.includes("service")) role = "service_advisor"

        const userData: User = {
          id: "1",
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email,
          role,
          avatar: email.substring(0, 2).toUpperCase(),
          phone: "+1 (555) 000-0000",
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }

        // Mock token
        const token = "mock_jwt_token_" + Date.now()

        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(userData))
        setUser(userData)

        return true
      }

      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)

      // In a real app, make API call to logout
      // await fetch('/api/v1/auth/logout', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` }
      // })

      // Clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout API fails, clear local session
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}