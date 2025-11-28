"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

// User role types based on the TON platform
export type UserRole = "admin" | "manager" | "accountant" | "service_advisor" | "mechanic" | "driver" | "vehicle_rental_company"

// Function to map backend role names to frontend role types
const mapBackendRole = (backendRole: string): UserRole => {
  const roleMapping: Record<string, UserRole> = {
    'super_admin': 'admin',
    'fleet_manager': 'manager',
    'finance_manager': 'accountant',
    'service_advisor': 'service_advisor',
    'mechanic': 'mechanic',
    'driver': 'driver',
    'vehicle_rental_company': 'vehicle_rental_company',
    'administrator': 'admin',  // Add mapping for "Administrator" role
  }
  // Normalize backend role by converting to lowercase and replacing underscores with dashes
  const normalizedRole = backendRole.toLowerCase().replace(/_/g, '-')

  return roleMapping[normalizedRole] || 'driver'
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  created_at?: string
  last_login?: string
  // Vehicle rental company specific fields
  companyId?: string  // Reference to vehicle rental company if user is a company
  companyName?: string
  companyLogo?: string
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

      // Check localStorage for existing session
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')

      if (token && userData) {
        const parsedUser = JSON.parse(userData)

        // Validate token with backend
        const response = await fetch('http://localhost:8080/api/v1/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setUser(parsedUser)
            return
          }
        }

        // Token validation failed, clear session
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        setUser(null)
      }

      setUser(null)
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

      // Call real backend API
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Store real JWT token
          const token = result.data.access_token
          const userData: User = {
            id: result.data.user.id.toString(),
            name: `${result.data.user.first_name} ${result.data.user.last_name}`.trim() || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            email: result.data.user.email,
            role: mapBackendRole(result.data.user.role),
            avatar: email.substring(0, 2).toUpperCase(),
            phone: result.data.user.phone || "+1 (555) 000-0000",
            created_at: result.data.user.created_at,
            last_login: new Date().toISOString(),
            companyId: result.data.user.company_id,
            companyName: result.data.user.company_name,
            companyLogo: result.data.user.company_logo
          }

          localStorage.setItem('auth_token', token)
          localStorage.setItem('user_data', JSON.stringify(userData))
          setUser(userData)

          return true
        }
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
      console.log('🚪 Logout: Starting logout process...')

      const token = localStorage.getItem('auth_token')

      if (!token) {
        console.log('⚠️ Logout: No auth token found in localStorage')
        // Clear local storage even if no token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        setUser(null)
        setIsLoading(false)
        return
      }

      console.log('🔐 Logout: Token found, calling backend API...')

      // Call real backend API
      const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
          }
        })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Logout: Backend response:', result)

        // Clear local storage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        setUser(null)

        console.log('✅ Logout: Local storage cleared, user state updated')
      } else {
        console.error('❌ Logout: Backend API call failed:', response.status, response.statusText)

        // Even if logout API fails, clear local session
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        setUser(null)
      }
    } catch (error) {
      console.error('💥 Logout: Exception occurred:', error)
      // Even if logout API fails, clear local session
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      setUser(null)
    } finally {
      setIsLoading(false)
      console.log('🏁 Logout: Process completed, loading state set to false')
    }
  }

  const updateUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))

      // Debug: Alert the current user role and role mapping
      alert(`User Role Debug: Current role = ${user.role}, Mapped role = ${mapBackendRole(user.role)}`)
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

// RBAC utility functions
export const canManageVehicles = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "admin" || user.role === "vehicle_rental_company" || user.role === "manager"
}

export const canRegisterVehicles = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "admin" || user.role === "vehicle_rental_company"
}

export const canViewAllVehicles = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "admin" || user.role === "manager"
}

export const canManageCompanyVehicles = (user: User | null, companyId: string): boolean => {
  if (!user) return false
  return user.role === "admin" ||
         (user.role === "vehicle_rental_company" && user.companyId === companyId)
}

export const isVehicleRentalCompany = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "vehicle_rental_company"
}

export const getUserCompanyInfo = (user: User | null) => {
  if (!user) {
    return null
  }

  // Allow both admin and vehicle_rental_company roles to access vehicle registration
  if (isVehicleRentalCompany(user)) {
    return {
      companyId: user.companyId!,
      companyName: user.companyName!,
      companyLogo: user.companyLogo || user.companyName?.substring(0, 2).toUpperCase()
    }
  }

  // For admin users, provide access to all vehicle rental companies or a default company
  if (user.role === "admin") {
    return {
      companyId: "admin-access",
      companyName: "System Administration",
      companyLogo: "AD",
      isAdmin: true
    }
  }

  return null
}