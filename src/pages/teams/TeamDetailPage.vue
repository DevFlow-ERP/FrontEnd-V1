<template>
  <q-page padding>
    <div v-if="isLoading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="3em" />
      <div class="q-mt-md text-grey-7">팀 정보를 불러오는 중...</div>
    </div>

    <template v-else-if="currentTeam">
      <div class="row justify-between items-center q-mb-md">
        <div>
          <div class="text-h4">{{ currentTeam.name }}</div>
          <div class="text-subtitle1 text-grey-7">
            {{ currentTeam.description }}
          </div>
        </div>
        <q-btn color="primary" icon="o_edit" label="팀 수정" />
      </div>

      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-3">
          <q-card>
            <q-card-section>
              <div class="text-caption text-grey-7">멤버</div>
              <div class="text-h5">
                {{ currentTeamStats?.member_count || 0 }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div class="text-h5 q-mb-md">팀 멤버 ({{ teamMembers.length }})</div>

      <TeamMemberList v-if="teamMembers.length > 0" :members="teamMembers" />

      <EmptyState
        v-else
        icon="o_group"
        title="멤버 없음"
        description="이 팀에는 아직 멤버가 없습니다."
      />
    </template>

    <template v-else-if="!isLoading && !currentTeam">
      <EmptyState
        icon="o_error"
        title="팀을 찾을 수 없습니다"
        description="요청한 팀이 존재하지 않거나 삭제되었습니다."
      >
        <q-btn color="primary" label="팀 목록으로 돌아가기" to="/teams" no-caps />
      </EmptyState>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTeamStore } from 'src/stores/team.store';
import { storeToRefs } from 'pinia';
import TeamMemberList from 'src/components/team/TeamMemberList.vue'; //
import EmptyState from 'src/components/common/EmptyState.vue';

// 1단계에서 정의한 'teamId' prop 받기
const props = defineProps({
  teamId: {
    type: Number,
    required: true,
  },
});

const teamStore = useTeamStore();

// 제공해주신 스토어의 state와 action을 사용합니다.
const { currentTeam, teamMembers, isLoading, currentTeamStats } = storeToRefs(teamStore);
const { fetchTeam, fetchTeamMembers, fetchTeamStats, clearCurrentTeam } = teamStore;

onMounted(() => {
  // 페이지 진입 시 팀 정보, 멤버, 통계를 모두 가져옵니다.
  void fetchTeam(props.teamId);
  void fetchTeamMembers(props.teamId);
  void fetchTeamStats(props.teamId);
});

onUnmounted(() => {
  // 페이지 이탈 시 스토어의 상세 데이터를 초기화합니다.
  clearCurrentTeam();
});
</script>
