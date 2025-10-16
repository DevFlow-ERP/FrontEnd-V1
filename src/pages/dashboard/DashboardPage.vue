<template>
  <q-page class="q-pa-md">
    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">대시보드</div>
        <div class="text-subtitle2 text-grey-7">
          프로젝트 및 이슈 현황을 한눈에 확인하세요
        </div>
      </div>
      <q-btn
        label="새 프로젝트"
        color="primary"
        icon="add"
        @click="$router.push('/projects/create')"
      />
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="folder" size="48px" color="primary" class="q-mr-md" />
              <div>
                <div class="text-h6 text-weight-bold">12</div>
                <div class="text-caption text-grey-7">프로젝트</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="sprint" size="48px" color="secondary" class="q-mr-md" />
              <div>
                <div class="text-h6 text-weight-bold">5</div>
                <div class="text-caption text-grey-7">활성 스프린트</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="bug_report" size="48px" color="warning" class="q-mr-md" />
              <div>
                <div class="text-h6 text-weight-bold">38</div>
                <div class="text-caption text-grey-7">활성 이슈</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="rocket_launch" size="48px" color="positive" class="q-mr-md" />
              <div>
                <div class="text-h6 text-weight-bold">24</div>
                <div class="text-caption text-grey-7">배포</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="row q-col-gutter-md">
      <!-- Recent Projects -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">최근 프로젝트</div>
            <q-list separator>
              <q-item v-for="i in 5" :key="i">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="folder" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>프로젝트 {{ i }}</q-item-label>
                  <q-item-label caption>최근 업데이트: 2시간 전</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="positive">활성</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- My Issues -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">내 이슈</div>
            <q-list separator>
              <q-item v-for="i in 5" :key="i">
                <q-item-section avatar>
                  <q-avatar color="warning" text-color="white" icon="bug_report" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>이슈 #{{ i }}</q-item-label>
                  <q-item-label caption>프로젝트 {{ i }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="info">진행중</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Welcome Banner -->
    <q-banner class="bg-primary text-white q-mt-md" rounded>
      <template v-slot:avatar>
        <q-icon name="info" size="md" />
      </template>
      <div class="text-body1">
        <strong>환영합니다!</strong> DevFlow ERP에 오신 것을 환영합니다.
        프로젝트 관리를 시작하려면 새 프로젝트를 생성해보세요.
      </div>
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
// Placeholder dashboard page
// Will be replaced with real data in Phase 3
</script>

<style scoped lang="scss">
// Dashboard specific styles
</style>
