<template>
  <div class="project-stats">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Project Statistics</div>

        <q-linear-progress
          v-if="loading"
          indeterminate
          color="primary"
          class="q-mb-md"
        />

        <div v-else class="stats-grid">
          <!-- Total Sprints -->
          <div class="stat-item">
            <q-icon name="view_week" size="32px" color="primary" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.total_sprints }}</div>
              <div class="stat-label">Total Sprints</div>
            </div>
          </div>

          <!-- Active Sprints -->
          <div class="stat-item">
            <q-icon name="play_circle" size="32px" color="positive" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.active_sprints }}</div>
              <div class="stat-label">Active Sprints</div>
            </div>
          </div>

          <!-- Total Issues -->
          <div class="stat-item">
            <q-icon name="assignment" size="32px" color="info" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.total_issues }}</div>
              <div class="stat-label">Total Issues</div>
            </div>
          </div>

          <!-- Open Issues -->
          <div class="stat-item">
            <q-icon name="warning" size="32px" color="warning" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.open_issues }}</div>
              <div class="stat-label">Open Issues</div>
            </div>
          </div>

          <!-- Completed Issues -->
          <div class="stat-item">
            <q-icon name="check_circle" size="32px" color="positive" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.completed_issues }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="stat-item">
            <q-icon name="people" size="32px" color="secondary" />
            <div class="stat-content">
              <div class="stat-value">{{ stats.team_members }}</div>
              <div class="stat-label">Team Members</div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="!loading" class="q-mt-lg">
          <div class="text-body2 text-grey-7 q-mb-xs">
            Completion Rate: {{ completionRate }}%
          </div>
          <q-linear-progress
            :value="completionRate / 100"
            color="positive"
            size="12px"
            rounded
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// ============================================
// Props & Emits
// ============================================

interface Props {
  projectId: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// ============================================
// State
// ============================================

const stats = ref({
  total_sprints: 0,
  active_sprints: 0,
  total_issues: 0,
  open_issues: 0,
  completed_issues: 0,
  team_members: 0,
});

// ============================================
// Computed
// ============================================

const completionRate = computed(() => {
  if (stats.value.total_issues === 0) return 0;
  return Math.round((stats.value.completed_issues / stats.value.total_issues) * 100);
});

// ============================================
// Methods
// ============================================

async function fetchStats() {
  // TODO: Implement API call to fetch project statistics
  // For now, using mock data
  try {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data
    stats.value = {
      total_sprints: 8,
      active_sprints: 2,
      total_issues: 47,
      open_issues: 23,
      completed_issues: 24,
      team_members: 6,
    };
  } catch (error) {
    console.error('Failed to fetch project stats:', error);
  }
}

// ============================================
// Lifecycle
// ============================================

onMounted(() => {
  void fetchStats();
});

watch(
  () => props.projectId,
  () => {
    void fetchStats();
  }
);
</script>

<style lang="scss" scoped>
.project-stats {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      transform: translateY(-2px);
    }
  }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// Dark mode support
.body--dark {
  .project-stats {
    .stat-item {
      background: rgba(255, 255, 255, 0.05);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
