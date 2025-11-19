<template>
  <q-form @submit="handleSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      label="Sprint Name *"
      outlined
      dense
      :rules="[(val) => !!val || 'Name is required']"
    />

    <q-input v-model="form.goal" label="Sprint Goal" outlined dense type="textarea" rows="3" />

    <div class="row q-col-gutter-sm">
      <div class="col-6">
        <q-input v-model="form.start_date" label="Start Date" outlined dense type="date" />
      </div>
      <div class="col-6">
        <q-input v-model="form.end_date" label="End Date" outlined dense type="date" />
      </div>
    </div>

    <q-select
      v-model="form.status"
      :options="statusOptions"
      label="Status"
      outlined
      dense
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon
              :name="getStatusIcon(scope.opt.value)"
              :color="getStatusColor(scope.opt.value)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:selected-item="scope">
        <div class="row items-center q-gutter-x-sm">
          <q-icon :name="getStatusIcon(scope.opt.value)" :color="getStatusColor(scope.opt.value)" />
          <span>{{ scope.opt.label }}</span>
        </div>
      </template>
    </q-select>
    <div class="row justify-end q-gutter-sm">
      <q-btn label="Cancel" flat color="grey" v-close-popup />
      <q-btn
        :label="isEdit ? 'Update' : 'Create'"
        type="submit"
        color="primary"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import type { Sprint, SprintCreate, SprintUpdate, SprintStatus } from 'src/types/models.types';

interface Props {
  sprint?: Sprint | undefined; // [!] undefined를 명시적으로 추가하여 타입 호환성 문제 해결
  projectId: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: 'submit', data: SprintCreate | SprintUpdate): void;
}>();

// State
const isEdit = computed(() => !!props.sprint);

// 상태 옵션 정의
const statusOptions = [
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

// Form Data
const form = reactive({
  name: '',
  goal: '',
  start_date: '',
  end_date: '',
  status: 'planning' as SprintStatus, // 기본값 설정
});

// Helper Functions for UI
function getStatusIcon(status: string) {
  switch (status) {
    case 'active':
      return 'play_circle';
    case 'completed':
      return 'check_circle';
    case 'cancelled':
      return 'cancel';
    default:
      return 'event_note'; // planning
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'primary';
    case 'completed':
      return 'positive';
    case 'cancelled':
      return 'negative';
    default:
      return 'grey'; // planning
  }
}

// Initialize Form
onMounted(() => {
  if (props.sprint) {
    form.name = props.sprint.name;
    form.goal = props.sprint.goal || '';
    // [!] 배열 접근 결과가 undefined일 수 있으므로 ?? '' 추가
    form.start_date = props.sprint.start_date ? (props.sprint.start_date.split('T')[0] ?? '') : '';
    form.end_date = props.sprint.end_date ? (props.sprint.end_date.split('T')[0] ?? '') : '';
    form.status = props.sprint.status; // 기존 상태 불러오기
  }
});

// Submit Handler
function handleSubmit() {
  const data = {
    ...form,
    start_date: form.start_date || undefined,
    end_date: form.end_date || undefined,
  };

  if (isEdit.value) {
    emit('submit', data as SprintUpdate);
  } else {
    emit('submit', {
      ...data,
      project_id: props.projectId,
    } as SprintCreate);
  }
}
</script>
