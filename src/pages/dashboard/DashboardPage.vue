<template>
  <q-page class="dashboard-page">
    <!-- Page Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold">Dashboard</div>
        <div class="text-subtitle2 text-grey-7">
          Welcome back, {{ userFullName }}
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="New Project"
          @click="handleCreateProject"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <stats-card
          title="Total Projects"
          :value="stats.totalProjects"
          icon="folder"
          color="primary"
          :loading="loading"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <stats-card
          title="Active Sprints"
          :value="stats.activeSprints"
          icon="timer"
          color="secondary"
          :loading="loading"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <stats-card
          title="Open Issues"
          :value="stats.openIssues"
          icon="bug_report"
          color="warning"
          :loading="loading"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <stats-card
          title="My Tasks"
          :value="stats.myTasks"
          icon="task"
          color="positive"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row q-col-gutter-lg">
      <!-- Left Column -->
      <div class="col-12 col-md-8">
        <!-- Recent Projects -->
        <q-card class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 q-mb-md">Recent Projects</div>
            <recent-projects :loading="loading" :projects="recentProjects" />
          </q-card-section>
        </q-card>

        <!-- Activity Feed -->
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Recent Activity</div>
            <activity-feed :loading="loading" :activities="activities" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Column -->
      <div class="col-12 col-md-4">
        <!-- My Issues -->
        <q-card class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 q-mb-md">My Issues</div>
            <my-issues :loading="loading" :issues="myIssues" />
          </q-card-section>
        </q-card>

        <!-- Sprint Progress -->
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Sprint Progress</div>
            <sprint-progress :loading="loading" :sprint="currentSprint" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';
import StatsCard from 'src/components/dashboard/StatsCard.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import RecentProjects from 'src/components/dashboard/RecentProjects.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MyIssues from 'src/components/dashboard/MyIssues.vue';
import ActivityFeed from 'src/components/dashboard/ActivityFeed.vue';
import SprintProgress from 'src/components/dashboard/SprintProgress.vue';

const router = useRouter();
const authStore = useAuthStore();

// ============================================
// State
// ============================================

const loading = ref(false);

const stats = ref({
  totalProjects: 0,
  activeSprints: 0,
  openIssues: 0,
  myTasks: 0,
});

const recentProjects = ref([]);
const myIssues = ref([]);
const activities = ref([]);
const currentSprint = ref(null);

// ============================================
// Computed
// ============================================

const userFullName = computed(() => authStore.userFullName);

// ============================================
// Methods
// ============================================

function loadDashboardData() {
  loading.value = true;
  try {
    // TODO: Implement API calls to fetch dashboard data
    // const [statsData, projectsData, issuesData, activitiesData, sprintData] = await Promise.all([
    //   fetchDashboardStats(),
    //   fetchRecentProjects(),
    //   fetchMyIssues(),
    //   fetchRecentActivities(),
    //   fetchCurrentSprint(),
    // ]);

    // Mock data for now
    stats.value = {
      totalProjects: 12,
      activeSprints: 3,
      openIssues: 47,
      myTasks: 8,
    };

    // Mock recent projects
    recentProjects.value = [];

    // Mock my issues
    myIssues.value = [];

    // Mock activities
    activities.value = [];

    // Mock current sprint
    currentSprint.value = null;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
}

function handleCreateProject() {
  void router.push('/projects/create');
}

// ============================================
// Lifecycle
// ============================================

onMounted(() => {
  loadDashboardData();
});
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

@media (max-width: $breakpoint-sm-max) {
  .dashboard-page {
    padding: 16px;
  }
}
</style>
