// ============================================
// API Client - Axios instance with interceptors
// ============================================

import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ApiError } from 'src/types/api.types';

// Custom error class for API errors
class ApiErrorClass extends Error {
  public readonly detail?: string | undefined;
  public readonly status: number;
  public readonly errors?: Record<string, string[]> | undefined;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiError';
    this.detail = apiError.detail;
    this.status = apiError.status;
    this.errors = apiError.errors;
  }
}

// ============================================
// Create Axios Instance
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor
// ============================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');

    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        message: error.response?.data?.message || error.message,
        detail: error.response?.data?.detail,
      });
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token } = response.data;

        // Save new token
        localStorage.setItem('access_token', access_token);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }

        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error('Token refresh failed')
        );
      }
    }

    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error('🚫 Access Denied:', error.response.data);
      // Optionally redirect to unauthorized page
      // window.location.href = '/auth/unauthorized';
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('🔍 Not Found:', error.response.data);
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('🔥 Server Error:', error.response.data);
    }

    // Transform error for consistent error handling
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      detail: error.response?.data?.detail,
      status: error.response?.status || 0,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(new ApiErrorClass(apiError));
  }
);

// ============================================
// Export
// ============================================

export default apiClient;

/**
 * Helper function to handle API errors consistently
 */
export function handleApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
    };
  }

  return {
    message: 'An unexpected error occurred',
    status: 0,
  };
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}
