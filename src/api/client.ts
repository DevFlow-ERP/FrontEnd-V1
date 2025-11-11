/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// API Client - Axios instance with interceptors
// (!!! THIS FILE IS MODIFIED FOR MOCKING !!!)
// ============================================

import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import type { ApiError } from 'src/types/api.types';
import { Notify } from 'quasar';

// +++ MOCK IMPORTS +++
import {
  mockPaginatedResponse,
  mockGetResponse,
  mockCreateResponse,
  mockUpdateResponse,
  mockDeleteResponse,
  mockSuccessResponse,
  mockResponse, // 404 응답을 위해 mockResponse 임포트
} from './_mockApi';
import {
  mockProjects,
  mockIssues,
  mockSprints,
  mockTeams,
  mockServers,
  mockServices,
  mockDeployments,
  mockUsers,
  mockDashboardStats,
} from './_mockData';
// (User 임포트 제거 - 'defined but never used' 오류 수정)
// ++++++++++++++++++++

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
// +++ MOCK API INTERCEPTOR +++
// (Wraps original methods to return mock data)
// ============================================

// 1. Store original methods (unbound-method 오류 수정을 위해 .bind(apiClient) 추가)
const originalGet = apiClient.get.bind(apiClient);
const originalPost = apiClient.post.bind(apiClient);
const originalPatch = apiClient.patch.bind(apiClient);
const originalDelete = apiClient.delete.bind(apiClient);
// (originalPut 제거 - 'assigned a value but never used' 오류 수정)

// 2. Override GET
apiClient.get = async (url: string, config?: AxiosRequestConfig): Promise<any> => {
  console.log(`%c[MOCK GET] ${url}`, 'color: #00aaff', config?.params);
  let match: RegExpMatchArray | null; // 'match' 타입 명시

  // Regex for ID-based routes
  const getProjectId = (url: string) => (url.match(/\/projects\/(\d+)/) || [])[1];
  const getSprintId = (url: string) => (url.match(/\/sprints\/(\d+)/) || [])[1];
  const getIssueId = (url: string) => (url.match(/\/issues\/(\d+)/) || [])[1];
  const getTeamId = (url: string) => (url.match(/\/teams\/(\d+)/) || [])[1];
  const getServerId = (url: string) => (url.match(/\/servers\/(\d+)/) || [])[1];
  const getServiceId = (url: string) => (url.match(/\/services\/(\d+)/) || [])[1];
  const getDeploymentId = (url: string) => (url.match(/\/deployments\/(\d+)/) || [])[1];
  // (getMemberId, getUserId 제거 - 'assigned a value but never used' 오류 수정)

  switch (true) {
    // === Dashboard ===
    case url === '/dashboard/stats':
      return mockSuccessResponse(mockDashboardStats);
    case url === '/dashboard/recent-projects':
      return mockPaginatedResponse(mockProjects, { page: 1, size: 5 });
    case url === '/dashboard/active-sprint':
      return mockSuccessResponse(mockSprints.find((s) => s.status === 'active') || null);
    case url === '/dashboard/my-issues': {
      // 'no-case-declarations' 오류 수정을 위해 {} 블록 추가
      const myIssues = mockIssues.filter((i) => i.assignee_id === 1); // User 1
      return mockPaginatedResponse(myIssues, { page: 1, size: 10 });
    }
    case url === '/dashboard/recent-deployments':
      return mockPaginatedResponse(mockDeployments, { page: 1, size: 5 });

    // === Auth ===
    case url === '/auth/me':
      return mockGetResponse(mockUsers, 2); // 'admin_user' (ID 2)
    case url === '/auth/verify':
      // Allow the backdoor token verification to pass through
      if (config?.headers?.Authorization === 'Bearer backdoor.dummy.token-this-is-not-real') {
        return Promise.resolve({ data: true });
      }
      return originalGet(url, config); // .call() 대신 바인딩된 함수 직접 호출

    // === Projects ===
    case !!(match = url.match(/\/projects\/(\d+)/)): // 'not comparable to type true' 오류 수정을 위해 !!(match=...) 사용
      return mockGetResponse(mockProjects, Number(match[1]));
    case url === '/projects':
      return mockPaginatedResponse(mockProjects, config?.params);

    // === Issues ===
    case !!(match = url.match(/\/projects\/(\d+)\/issues/)): // Project-specific issues
      return mockPaginatedResponse(mockIssues, {
        ...config?.params,
        project_id: Number(match[1]),
      });
    case !!(match = url.match(/\/issues\/(\d+)/)):
      return mockGetResponse(mockIssues, Number(match[1]));
    case url === '/issues':
      return mockPaginatedResponse(mockIssues, config?.params);
    case url === '/issues/me': {
      // 'no-case-declarations' 오류 수정을 위해 {} 블록 추가
      const myIssuesMe = mockIssues.filter((i) => i.assignee_id === 1); // Assuming user 1
      return mockPaginatedResponse(myIssuesMe, config?.params);
    }

    // === Sprints ===
    case !!(match = url.match(/\/projects\/(\d+)\/sprints/)): // Project-specific sprints
      return mockPaginatedResponse(mockSprints, {
        ...config?.params,
        project_id: Number(match[1]),
      });
    case !!(match = url.match(/\/sprints\/(\d+)/)):
      return mockGetResponse(mockSprints, Number(match[1]));
    case url === '/sprints':
      return mockPaginatedResponse(mockSprints, config?.params);

    // === Teams ===
    case !!(match = url.match(/\/teams\/(\d+)/)):
      return mockGetResponse(mockTeams, Number(match[1]));
    case url === '/teams':
      return mockPaginatedResponse(mockTeams, config?.params);

    // === Servers ===
    case !!(match = url.match(/\/servers\/(\d+)/)):
      return mockGetResponse(mockServers, Number(match[1]));
    case url === '/servers':
      return mockPaginatedResponse(mockServers, config?.params);

    // === Services ===
    case !!(match = url.match(/\/services\/(\d+)/)):
      return mockGetResponse(mockServices, Number(match[1]));
    case url === '/services':
      return mockPaginatedResponse(mockServices, config?.params);

    // === Deployments ===
    case !!(match = url.match(/\/deployments\/(\d+)/)):
      return mockGetResponse(mockDeployments, Number(match[1]));
    case url === '/deployments':
      return mockPaginatedResponse(mockDeployments, config?.params);

    // Fallback to original
    default:
      console.warn(`[MOCK] No GET handler for ${url}, falling back to real request.`);
      return originalGet(url, config);
  }
};

// 3. Override POST
apiClient.post = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> => {
  console.log(`%c[MOCK POST] ${url}`, 'color: #00cc66', data);
  let match: RegExpMatchArray | null;
  switch (true) {
    // === Auth (Keep real auth for backdoor) ===
    case url === '/auth/login':
    case url === '/auth/logout':
    case url === '/auth/refresh':
      return originalPost(url, data, config);

    // === Issues ===
    case url === '/issues':
      return mockCreateResponse(mockIssues, data);

    // === Projects ===
    case url === '/projects':
      return mockCreateResponse(mockProjects, data);

    // === Sprints ===
    case url === '/sprints':
      return mockCreateResponse(mockSprints, data);
    case !!(match = url.match(/\/sprints\/(\d+)\/(start|complete)/)):
      return mockUpdateResponse(mockSprints, Number(match[1]), {
        status: match[2] === 'start' ? 'active' : 'completed',
      });

    // === Teams ===
    case url === '/teams':
      return mockCreateResponse(mockTeams, data);

    // === Servers ===
    case url === '/servers':
      return mockCreateResponse(mockServers, data);

    // === Services ===
    case url === '/services':
      return mockCreateResponse(mockServices, data);

    // === Deployments ===
    case url === '/deployments':
      return mockCreateResponse(mockDeployments, { ...data, deployed_by: 2 }); // Admin user
    case !!(match = url.match(/\/deployments\/(\d+)\/rollback/)): {
      // 'no-case-declarations' 오류 수정을 위해 {} 블록 추가
      const target = mockDeployments.find((d) => d.id === Number(match[1]));
      // 'Expected 0-1 arguments, but got 2' 오류 수정을 위해 mockResponse 사용
      if (!target) return mockResponse({ error: 'Not Found' }, 404);

      // 'is not assignable' 오류 수정을 위해 누락된 속성 추가
      return mockCreateResponse(mockDeployments, {
        service_id: target.service_id,
        version: `${target.version}-ROLLBACK`,
        environment: target.environment,
        commit_hash: target.commit_hash,
        type: 'rollback',
        status: 'success',
        deployed_by: 2, // Admin user
        notes: data?.notes || 'Rolled back',
        rollback_from_id: target.id,
        // --- 누락된 속성 추가 ---
        branch: target.branch,
        tag: null,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        error_message: null,
        log_url: null,
      });
    }

    // Fallback to original
    default:
      console.warn(`[MOCK] No POST handler for ${url}, falling back to real request.`);
      return originalPost(url, data, config);
  }
};

// 4. Override PATCH
apiClient.patch = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> => {
  console.log(`%c[MOCK PATCH] ${url}`, 'color: #ffaa00', data);
  let match: RegExpMatchArray | null;
  switch (true) {
    // === Issues ===
    case !!(match = url.match(/\/issues\/(\d+)/)):
      return mockUpdateResponse(mockIssues, Number(match[1]), data);

    // === Projects ===
    case !!(match = url.match(/\/projects\/(\d+)/)):
      return mockUpdateResponse(mockProjects, Number(match[1]), data);

    // === Sprints ===
    case !!(match = url.match(/\/sprints\/(\d+)/)):
      return mockUpdateResponse(mockSprints, Number(match[1]), data);

    // === Teams ===
    case !!(match = url.match(/\/teams\/(\d+)/)):
      return mockUpdateResponse(mockTeams, Number(match[1]), data);

    // === Servers ===
    case !!(match = url.match(/\/servers\/(\d+)/)):
      return mockUpdateResponse(mockServers, Number(match[1]), data);

    // === Services ===
    case !!(match = url.match(/\/services\/(\d+)/)):
      return mockUpdateResponse(mockServices, Number(match[1]), data);

    // === Deployments ===
    case !!(match = url.match(/\/deployments\/(\d+)/)):
      return mockUpdateResponse(mockDeployments, Number(match[1]), data);

    // Fallback to original
    default:
      console.warn(`[MOCK] No PATCH handler for ${url}, falling back to real request.`);
      return originalPatch(url, data, config);
  }
};

// 5. Override DELETE
apiClient.delete = async (url: string, config?: AxiosRequestConfig): Promise<any> => {
  console.log(`%c[MOCK DELETE] ${url}`, 'color: #ff0000');
  let match: RegExpMatchArray | null;
  switch (true) {
    // === Issues ===
    case !!(match = url.match(/\/issues\/(\d+)/)):
      return mockDeleteResponse(mockIssues, Number(match[1]));

    // === Projects ===
    case !!(match = url.match(/\/projects\/(\d+)/)):
      return mockDeleteResponse(mockProjects, Number(match[1]));

    // === Sprints ===
    case !!(match = url.match(/\/sprints\/(\d+)/)):
      return mockDeleteResponse(mockSprints, Number(match[1]));

    // === Teams ===
    case !!(match = url.match(/\/teams\/(\d+)/)):
      return mockDeleteResponse(mockTeams, Number(match[1]));

    // === Servers ===
    case !!(match = url.match(/\/servers\/(\d+)/)):
      return mockDeleteResponse(mockServers, Number(match[1]));

    // === Services ===
    case !!(match = url.match(/\/services\/(\d+)/)):
      return mockDeleteResponse(mockServices, Number(match[1]));

    // === Deployments ===
    case !!(match = url.match(/\/deployments\/(\d+)/)):
      return mockDeleteResponse(mockDeployments, Number(match[1]));

    // Fallback to original
    default:
      console.warn(`[MOCK] No DELETE handler for ${url}, falling back to real request.`);
      return originalDelete(url, config);
  }
};

// ============================================
// Request Interceptor (Original)
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
      // (Mock logging is handled above)
      if (!config.url?.startsWith('%c[MOCK')) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        });
      }
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// ============================================
// Response Interceptor (Original)
// ============================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      if (!response.config.url?.startsWith('%c[MOCK')) {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
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

        // Call refresh token endpoint (using original method)
        // 'is of type unknown' 오류 수정을 위해 타입 단언 추가
        const response = await originalPost(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
        );

        const { access_token } = response.data;

        // Save new token
        localStorage.setItem('access_token', access_token);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        // Retry the original request (e.g., apiClient.get, apiClient.post...)
        // We use the 'axios(originalRequest)' pattern which correctly re-uses the original method (GET, POST, etc.)
        return axios(originalRequest);
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
          refreshError instanceof Error ? refreshError : new Error('Token refresh failed'),
        );
      }
    }

    // ... (Original 403, 404, 500, 400 Notify handlers remain unchanged) ...
    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error('🚫 Access Denied:', error.response.data);
      Notify.create({
        type: 'negative',
        message: '접근 권한이 없습니다',
        caption: error.response.data?.detail || '이 작업을 수행할 권한이 없습니다.',
        position: 'top-right',
        timeout: 5000,
      });
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('🔍 Not Found:', error.response.data);
      Notify.create({
        type: 'warning',
        message: '요청한 리소스를 찾을 수 없습니다',
        caption: error.response.data?.detail || '존재하지 않는 데이터입니다.',
        position: 'top-right',
        timeout: 4000,
      });
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('🔥 Server Error:', error.response.data);
      Notify.create({
        type: 'negative',
        message: '서버 오류가 발생했습니다',
        caption: '잠시 후 다시 시도해주세요.',
        position: 'top-right',
        timeout: 5000,
        actions: [
          {
            label: '새로고침',
            color: 'white',
            handler: () => {
              window.location.reload();
            },
          },
        ],
      });
    }

    // Handle 400 Bad Request
    if (error.response?.status === 400) {
      Notify.create({
        type: 'warning',
        message: '잘못된 요청입니다',
        caption: error.response.data?.detail || '입력 데이터를 확인해주세요.',
        position: 'top-right',
        timeout: 4000,
      });
    }

    // Transform error for consistent error handling
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      detail: error.response?.data?.detail,
      status: error.response?.status || 0,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(new ApiErrorClass(apiError));
  },
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
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error;
}
