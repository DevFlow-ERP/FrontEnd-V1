// ============================================
// Router Routes - Application routes configuration
// ============================================

import type { RouteRecordRaw } from 'vue-router';
import { authGuard, guestGuard } from './guards';

const routes: RouteRecordRaw[] = [
  // ============================================
  // Authentication Routes (Public)
  // ============================================
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    beforeEnter: guestGuard,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { title: '로그인' },
      },
      {
        path: 'callback',
        name: 'callback',
        component: () => import('pages/auth/CallbackPage.vue'),
        meta: { title: 'SSO 인증 처리' },
      },
    ],
  },

  // Unauthorized page (no guard - accessible to all)
  {
    path: '/auth/unauthorized',
    name: 'unauthorized',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/auth/UnauthorizedPage.vue'),
        meta: { title: '접근 권한 없음' },
      },
    ],
  },

  // ============================================
  // Main Application Routes (Protected)
  // ============================================
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: authGuard,
    children: [
      // Redirect root to dashboard
      {
        path: '',
        redirect: '/dashboard',
      },

      // Dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        meta: { title: '대시보드' },
      },

      // Projects (Placeholder routes)
      {
        path: 'projects',
        name: 'projects',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '프로젝트' },
      },

      // Sprints (Placeholder routes)
      {
        path: 'sprints',
        name: 'sprints',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '스프린트' },
      },

      // Issues (Placeholder routes)
      {
        path: 'issues',
        name: 'issues',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '이슈' },
      },

      // Kanban Board (Placeholder route)
      {
        path: 'kanban',
        name: 'kanban',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '칸반 보드' },
      },

      // Teams (Placeholder routes)
      {
        path: 'teams',
        name: 'teams',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '팀' },
      },

      // Resources - Servers (Placeholder routes)
      {
        path: 'resources/servers',
        name: 'servers',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '서버' },
      },

      // Resources - Services (Placeholder routes)
      {
        path: 'resources/services',
        name: 'services',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '서비스' },
      },

      // Deployments (Placeholder routes)
      {
        path: 'deployments',
        name: 'deployments',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '배포' },
      },

      // Profile (Placeholder)
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '프로필' },
      },

      // Settings (Placeholder)
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: '설정' },
      },
    ],
  },

  // ============================================
  // Error Routes
  // ============================================
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { title: '페이지를 찾을 수 없습니다' },
  },
];

export default routes;
