'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthState,
  AuthContextType,
  AuthError
} from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: AuthError }
  | { type: 'REFRESH_SUCCESS'; payload: User }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'REFRESH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        console.log('🚫 [AuthContext] Running on server, skipping auth check');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const token = localStorage.getItem('access_token');
      console.log('🔍 [AuthContext] Checking auth status on mount:', {
        hasToken: !!token,
        tokenLength: token?.length,
        timestamp: new Date().toISOString()
      });

      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          console.log('📡 [AuthContext] Calling getProfile API...');
          const response = await apiClient.getProfile();

          console.log('📥 [AuthContext] getProfile response:', {
            success: response.success,
            hasData: !!response.data,
            errorMessage: response.error?.message,
            responseData: response.data
          });

          if (response.success && response.data) {
            console.log('✅ [AuthContext] Token validated, setting user:', response.data);
            dispatch({ type: 'REFRESH_SUCCESS', payload: response.data });
          } else {
            console.log('❌ [AuthContext] Invalid token response, clearing auth');
            // Invalid token, clear it
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.log('💥 [AuthContext] Token validation failed, clearing auth:', {
            errorMessage: error.message,
            errorCode: error.code,
            errorDetails: error.details,
            fullError: error
          });
          // Token validation failed, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          dispatch({ type: 'LOGOUT' });
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      console.log('🔐 [AuthContext] Login attempt started with:', {
        email: credentials.email,
        timestamp: new Date().toISOString()
      });

      dispatch({ type: 'LOGIN_START' });

      console.log('📡 [AuthContext] Calling apiClient.login...');
      const response = await apiClient.login(credentials.email, credentials.password);

      console.log('📥 [AuthContext] API response received:', {
        success: response.success,
        hasData: !!response.data,
        errorMessage: response.error?.message,
        errorCode: response.error?.code,
        responseData: response.data
      });

      if (!response.success || !response.data) {
        const errorMsg = response.error?.message || 'Login failed';
        console.log('❌ [AuthContext] Login failed - invalid response:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ [AuthContext] Login successful - dispatching success');
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
    } catch (error: any) {
      console.log('💥 [AuthContext] Login error caught:', {
        message: error.message,
        code: error.code,
        field: error.field,
        details: error.details,
        fullError: error
      });

      const authError: AuthError = {
        message: error.message || 'Login failed',
        code: error.code || 'LOGIN_ERROR',
        field: error.field,
      };
      dispatch({ type: 'LOGIN_FAILURE', payload: authError });
      throw authError;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'REGISTER_START' });

      const response = await apiClient.register(userData);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Registration failed');
      }

      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data.user });
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Registration failed',
        code: error.code || 'REGISTER_ERROR',
        field: error.field,
      };
      dispatch({ type: 'REGISTER_FAILURE', payload: authError });
      throw authError;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Even if logout API fails, clear local state
      console.error('Logout API error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<void> => {
    try {
      const response = await apiClient.get('/api/v1/auth/refresh');

      if (response.success && response.data) {
        dispatch({ type: 'REFRESH_SUCCESS', payload: response.data.user });
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  // Change password function
  const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    try {
      const response = await apiClient.changePassword(data.current_password, data.new_password);

      if (!response.success) {
        throw new Error(response.error?.message || 'Password change failed');
      }
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Password change failed',
        code: error.code || 'PASSWORD_CHANGE_ERROR',
      };
      dispatch({ type: 'SET_ERROR', payload: authError });
      throw authError;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;