import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, HttpMethod } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = '') {
    // If baseURL is provided (for direct backend calls), use it
    // Otherwise, use relative URLs for Next.js API routes
    this.baseURL = baseURL || '';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getAccessToken(): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('access_token');
      }
    } catch (error) {
      console.warn('Failed to access localStorage for access token:', error);
    }
    return null;
  }

  private getRefreshToken(): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('refresh_token');
      }
    } catch (error) {
      console.warn('Failed to access localStorage for refresh token:', error);
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
      }
    } catch (error) {
      console.warn('Failed to set tokens in localStorage:', error);
    }
  }

  private clearTokens() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.warn('Failed to clear tokens from localStorage:', error);
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.client.post('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data.data;
      this.setTokens(access_token, newRefreshToken);
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        code: error.response.data?.error?.code || 'SERVER_ERROR',
        message: error.response.data?.error?.message || 'Server error occurred',
        details: error.response.data?.error?.details,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred. Please check your connection.',
      };
    } else {
      // Something else happened
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
      };
    }
  }

  // Generic request method
  public async request<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    console.log('🌐 [ApiClient] HTTP Request:', {
      method,
      url: `${this.baseURL}${url}`,
      hasData: !!data,
      dataType: typeof data,
      timestamp: new Date().toISOString()
    });

    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client({
        method,
        url,
        data,
        ...config,
      });

      console.log('📬 [ApiClient] HTTP Response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        responseData: response.data,
        headers: response.headers
      });

      return response.data;
    } catch (error: any) {
      console.log('🚨 [ApiClient] HTTP Error:', {
        errorMessage: error.message,
        errorCode: error.code,
        errorResponse: error.response?.data,
        errorStatus: error.response?.status,
        errorStatusText: error.response?.statusText,
        errorConfig: error.config
      });

      const apiError = this.handleError(error);
      console.log('🛠️ [ApiClient] Processed API Error:', apiError);
      throw apiError;
    }
  }

  // HTTP method shortcuts
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // Authentication methods
  public async login(email: string, password: string) {
    console.log('🚀 [ApiClient] Login request initiated:', {
      baseURL: this.baseURL,
      endpoint: '/api/v1/auth/login',
      email: email,
      timestamp: new Date().toISOString()
    });

    try {
      const response = await this.post('/api/v1/auth/login', {
        email,
        password,
      });

      console.log('📨 [ApiClient] Login API response received:', {
        success: response.success,
        hasData: !!response.data,
        statusCode: response.status,
        message: response.message,
        error: response.error,
        fullResponse: response
      });

      if (response.success && response.data) {
        const { access_token, refresh_token } = response.data;
        console.log('🔑 [ApiClient] Storing tokens:', {
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          accessTokenLength: access_token?.length
        });
        this.setTokens(access_token, refresh_token);
      } else {
        console.log('⚠️ [ApiClient] Login response not successful:', response);
      }

      return response;
    } catch (error) {
      console.log('💥 [ApiClient] Login API request failed:', {
        error: error,
        errorMessage: error.message,
        errorCode: error.code,
        errorStatus: error.status,
        errorDetails: error.details
      });
      throw error;
    }
  }

  public async register(userData: any) {
    return this.post('/api/v1/auth/register', userData);
  }

  public async logout() {
    try {
      await this.post('/api/v1/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  public async validateToken(token: string) {
    return this.post('/api/v1/auth/validate', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async changePassword(currentPassword: string, newPassword: string) {
    return this.post('/api/v1/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  public async getProfile() {
    return this.get('/api/v1/auth/profile');
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };