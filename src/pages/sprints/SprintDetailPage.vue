<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="handleBack" />
      <div class="q-ml-md">
        <div class="text-h5">{{ sprint?.name || 'Loading...' }}</div>
        <div class="text-caption text-grey-7">스프린트 ID #{{ sprintId }}</div>
      </div>
      <q-space />
      <q-btn v-if="sprint" flat icon="edit" label="수정" color="primary" @click="handleEdit" />
    </div>

    <div v-if="isLoading" class="row justify-center q-py-xl">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-else-if="error" class="row justify-center q-py-xl">
      <q-card flat bordered class="q-pa-lg">
        <q-card-section class="text-center">
          <q-icon name="error" size="64px" color="negative" />
          <div class="text-h6 q-mt-md">{{ error }}</div>
          <q-btn
            label="목록으로 돌아가기"
            color="primary"
            flat
            class="q-mt-md"
            @click="handleBack"
          />
        </q-card-section>
      </q-card>
    </div>

    <div v-else-if="sprint" class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">스프린트 목표</div>
            <div v-if="sprint.goal" class="text-body1">
              {{ sprint.goal }}
            </div>
            <div v-else class="text-body2 text-grey-6">설정된 목표가 없습니다.</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">상세 정보</div>
            <q-list dense separator>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="label" />
                </q-item-section>
                <q-item-section>상태</q-item-section>
                <q-item-section side>
                  <status-badge type="sprint-status" :value="sprint.status" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="folder" />
                </q-item-section>
                <q-item-section>프로젝트</q-item-section>
                <q-item-section side> Project #{{ sprint.project_id }} </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="event" />
                </q-item-section>
                <q-item-section>시작일</q-item-section>
                <q-item-section side>
                  {{ formatDate(sprint.start_date) }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="event_busy" />
                </q-item-section>
                <q-item-section>종료일</q-item-section>
                <q-item-section side>
                  {{ formatDate(sprint.end_date) }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="schedule" />
                </q-item-section>
                <q-item-section>생성일</q-item-section>
                <q-item-section side>
                  {{ formatRelativeTime(sprint.created_at) }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="update" />
                </q-item-section>
                <q-item-section>수정일</q-item-section>
                <q-item-section side>
                  {{ formatRelativeTime(sprint.updated_at) }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSprintStore } from 'src/stores/sprint.store';
import { storeToRefs } from 'pinia';
import { formatDate, formatRelativeTime } from 'src/utils/formatters';
import StatusBadge from 'src/components/common/StatusBadge.vue';

const route = useRoute();
const router = useRouter();
const sprintStore = useSprintStore();

const sprintId = Number(route.params.id);

// 스토어의 상태와 게터를 가져옵니다.
const { currentSprint: sprint, isLoading, error } = storeToRefs(sprintStore);

// 페이지가 마운트될 때 스토어에서 단일 스프린트 데이터를 가져옵니다.
onMounted(async () => {
  try {
    await sprintStore.fetchSprint(sprintId);
  } catch (err) {
    console.error('스프린트 정보를 불러오는데 실패했습니다.', err);
  }
});

function handleBack() {
  void router.push('/sprints');
}

function handleEdit() {
  // TODO: 수정 다이얼로그 열기
  alert('수정 기능은 준비 중입니다.');
}
</script>
