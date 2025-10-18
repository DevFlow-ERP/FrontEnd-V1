<template>
  <q-breadcrumbs v-if="breadcrumbs.length > 0" class="text-grey-7" active-color="primary">
    <q-breadcrumbs-el
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :label="item.label"
      :icon="item.icon"
      :to="item.to"
      :class="{ 'cursor-default': !item.to }"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// ============================================
// Types
// ============================================

interface BreadcrumbItem {
  label: string;
  icon?: string;
  to?: string;
}

// ============================================
// Composables
// ============================================

const route = useRoute();

// ============================================
// Breadcrumb Configuration
// ============================================

const breadcrumbMap: Record<string, BreadcrumbItem> = {
  dashboard: { label: '대시보드', icon: 'dashboard' },
  projects: { label: '프로젝트', icon: 'folder' },
  'project-detail': { label: '프로젝트 상세', icon: 'folder_open' },
  sprints: { label: '스프린트', icon: 'sprint' },
  'sprint-detail': { label: '스프린트 상세', icon: 'event' },
  issues: { label: '이슈', icon: 'bug_report' },
  'issue-detail': { label: '이슈 상세', icon: 'assignment' },
  kanban: { label: '칸반 보드', icon: 'view_column' },
  teams: { label: '팀', icon: 'groups' },
  'team-detail': { label: '팀 상세', icon: 'group' },
  servers: { label: '서버', icon: 'storage' },
  'server-detail': { label: '서버 상세', icon: 'storage' },
  services: { label: '서비스', icon: 'api' },
  'service-detail': { label: '서비스 상세', icon: 'api' },
  deployments: { label: '배포', icon: 'rocket_launch' },
  'deployment-detail': { label: '배포 상세', icon: 'cloud_upload' },
  profile: { label: '프로필', icon: 'person' },
  settings: { label: '설정', icon: 'settings' },
};

// ============================================
// Computed
// ============================================

const breadcrumbs = computed(() => {
  const items: BreadcrumbItem[] = [];

  // Always start with Home
  items.push({
    label: '홈',
    icon: 'home',
    to: '/dashboard',
  });

  // Get current route name
  const routeName = route.name as string;
  if (!routeName) return items;

  // Handle special cases
  if (routeName.startsWith('project')) {
    items.push({
      label: '프로젝트',
      to: '/projects',
    });
    if (routeName === 'project-detail') {
      items.push({
        label: breadcrumbMap['project-detail']?.label || '상세',
      });
    }
  } else if (routeName.startsWith('sprint')) {
    items.push({
      label: '스프린트',
      to: '/sprints',
    });
    if (routeName === 'sprint-detail') {
      items.push({
        label: breadcrumbMap['sprint-detail']?.label || '상세',
      });
    }
  } else if (routeName.startsWith('issue')) {
    items.push({
      label: '이슈',
      to: '/issues',
    });
    if (routeName === 'issue-detail') {
      items.push({
        label: breadcrumbMap['issue-detail']?.label || '상세',
      });
    }
  } else if (routeName.startsWith('team')) {
    items.push({
      label: '팀',
      to: '/teams',
    });
    if (routeName === 'team-detail') {
      items.push({
        label: breadcrumbMap['team-detail']?.label || '상세',
      });
    }
  } else if (routeName === 'servers' || routeName === 'server-detail') {
    items.push({
      label: '리소스',
    });
    items.push({
      label: '서버',
      ...(routeName === 'server-detail' && { to: '/resources/servers' }),
    });
    if (routeName === 'server-detail') {
      items.push({
        label: '서버 상세',
      });
    }
  } else if (routeName === 'services' || routeName === 'service-detail') {
    items.push({
      label: '리소스',
    });
    items.push({
      label: '서비스',
      ...(routeName === 'service-detail' && { to: '/resources/services' }),
    });
    if (routeName === 'service-detail') {
      items.push({
        label: '서비스 상세',
      });
    }
  } else if (routeName.startsWith('deployment')) {
    items.push({
      label: '배포',
      to: '/deployments',
    });
    if (routeName === 'deployment-detail') {
      items.push({
        label: breadcrumbMap['deployment-detail']?.label || '상세',
      });
    }
  } else if (breadcrumbMap[routeName]) {
    // Simple routes (dashboard, kanban, profile, settings)
    if (routeName !== 'dashboard') {
      const item = breadcrumbMap[routeName];
      items.push({
        label: item.label,
        ...(item.icon && { icon: item.icon }),
      });
    }
  }

  return items;
});
</script>

<style scoped lang="scss">
.cursor-default {
  cursor: default;
  pointer-events: none;
}
</style>
