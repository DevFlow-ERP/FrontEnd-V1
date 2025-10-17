<template>
  <q-badge
    :color="badgeColor"
    :text-color="textColor"
    :label="label"
    :class="badgeClass"
  >
    <q-icon v-if="icon" :name="icon" size="14px" class="q-mr-xs" />
    {{ label }}
  </q-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  IssueStatus,
  IssuePriority,
  IssueType,
  SprintStatus,
  ProjectStatus,
  ServerStatus,
  ServiceStatus,
  DeploymentStatus,
  TeamRole,
} from 'src/types/models.types';
import {
  ISSUE_STATUS_COLORS,
  ISSUE_PRIORITY_COLORS,
  ISSUE_TYPE_COLORS,
  SPRINT_STATUS_COLORS,
  PROJECT_STATUS_COLORS,
  SERVER_STATUS_COLORS,
  SERVICE_STATUS_COLORS,
  DEPLOYMENT_STATUS_COLORS,
  TEAM_ROLE_COLORS,
  ISSUE_STATUS_OPTIONS,
  ISSUE_PRIORITY_OPTIONS,
  ISSUE_TYPE_OPTIONS,
  SPRINT_STATUS_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  SERVER_STATUS_OPTIONS,
  SERVICE_STATUS_OPTIONS,
  DEPLOYMENT_STATUS_OPTIONS,
  TEAM_ROLE_OPTIONS,
} from 'src/utils/constants';

// ============================================
// Props
// ============================================

interface Props {
  type:
    | 'issue-status'
    | 'issue-priority'
    | 'issue-type'
    | 'sprint-status'
    | 'project-status'
    | 'server-status'
    | 'service-status'
    | 'deployment-status'
    | 'team-role';
  value: string;
  textColor?: string;
  showIcon?: boolean;
  outlined?: boolean;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  textColor: 'white',
  showIcon: true,
  outlined: false,
  rounded: false,
});

// ============================================
// Computed
// ============================================

const badgeColor = computed(() => {
  switch (props.type) {
    case 'issue-status':
      return ISSUE_STATUS_COLORS[props.value as IssueStatus] || 'grey';
    case 'issue-priority':
      return ISSUE_PRIORITY_COLORS[props.value as IssuePriority] || 'grey';
    case 'issue-type':
      return ISSUE_TYPE_COLORS[props.value as IssueType] || 'grey';
    case 'sprint-status':
      return SPRINT_STATUS_COLORS[props.value as SprintStatus] || 'grey';
    case 'project-status':
      return PROJECT_STATUS_COLORS[props.value as ProjectStatus] || 'grey';
    case 'server-status':
      return SERVER_STATUS_COLORS[props.value as ServerStatus] || 'grey';
    case 'service-status':
      return SERVICE_STATUS_COLORS[props.value as ServiceStatus] || 'grey';
    case 'deployment-status':
      return DEPLOYMENT_STATUS_COLORS[props.value as DeploymentStatus] || 'grey';
    case 'team-role':
      return TEAM_ROLE_COLORS[props.value as TeamRole] || 'grey';
    default:
      return 'grey';
  }
});

const label = computed(() => {
  let options;
  switch (props.type) {
    case 'issue-status':
      options = ISSUE_STATUS_OPTIONS;
      break;
    case 'issue-priority':
      options = ISSUE_PRIORITY_OPTIONS;
      break;
    case 'issue-type':
      options = ISSUE_TYPE_OPTIONS;
      break;
    case 'sprint-status':
      options = SPRINT_STATUS_OPTIONS;
      break;
    case 'project-status':
      options = PROJECT_STATUS_OPTIONS;
      break;
    case 'server-status':
      options = SERVER_STATUS_OPTIONS;
      break;
    case 'service-status':
      options = SERVICE_STATUS_OPTIONS;
      break;
    case 'deployment-status':
      options = DEPLOYMENT_STATUS_OPTIONS;
      break;
    case 'team-role':
      options = TEAM_ROLE_OPTIONS;
      break;
    default:
      return props.value;
  }

  const option = options.find((opt) => opt.value === props.value);
  return option?.label || props.value;
});

const icon = computed(() => {
  if (!props.showIcon) return null;

  let options;
  switch (props.type) {
    case 'issue-status':
      options = ISSUE_STATUS_OPTIONS;
      break;
    case 'issue-priority':
      options = ISSUE_PRIORITY_OPTIONS;
      break;
    case 'issue-type':
      options = ISSUE_TYPE_OPTIONS;
      break;
    case 'sprint-status':
      options = SPRINT_STATUS_OPTIONS;
      break;
    case 'project-status':
      options = PROJECT_STATUS_OPTIONS;
      break;
    case 'server-status':
      options = SERVER_STATUS_OPTIONS;
      break;
    case 'service-status':
      options = SERVICE_STATUS_OPTIONS;
      break;
    case 'deployment-status':
      options = DEPLOYMENT_STATUS_OPTIONS;
      break;
    case 'team-role':
      options = TEAM_ROLE_OPTIONS;
      break;
    default:
      return null;
  }

  const option = options.find((opt) => opt.value === props.value);
  return option?.icon || null;
});

const badgeClass = computed(() => {
  const classes: string[] = [];
  if (props.outlined) classes.push('badge-outlined');
  if (props.rounded) classes.push('badge-rounded');
  return classes.join(' ');
});
</script>

<style scoped lang="scss">
.badge-outlined {
  border: 1px solid currentColor;
  background: transparent !important;
}

.badge-rounded {
  border-radius: 12px;
}
</style>
