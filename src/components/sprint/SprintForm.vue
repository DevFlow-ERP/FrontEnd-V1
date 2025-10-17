<template>
  <q-form @submit="handleSubmit" class="sprint-form">
    <!-- Name -->
    <q-input
      v-model="formData.name"
      label="Sprint Name *"
      :rules="[(val) => !!val || 'Name is required']"
      outlined
      class="q-mb-md"
    />

    <!-- Project -->
    <q-select
      v-model="formData.project_id"
      :options="projectOptions"
      label="Project *"
      :rules="[(val) => !!val || 'Project is required']"
      outlined
      emit-value
      map-options
      class="q-mb-md"
    />

    <!-- Goal -->
    <q-input
      v-model="formData.goal"
      label="Sprint Goal"
      type="textarea"
      rows="3"
      outlined
      class="q-mb-md"
    />

    <!-- Dates -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.start_date"
          label="Start Date *"
          type="date"
          :rules="[(val) => !!val || 'Start date is required']"
          outlined
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.end_date"
          label="End Date *"
          type="date"
          :rules="[
            (val) => !!val || 'End date is required',
            (val) => !formData.start_date || val >= formData.start_date || 'End date must be after start date'
          ]"
          outlined
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="row q-col-gutter-sm justify-end">
      <div class="col-auto">
        <q-btn
          label="Cancel"
          flat
          @click="handleCancel"
        />
      </div>
      <div class="col-auto">
        <q-btn
          :label="isEdit ? 'Update' : 'Create'"
          type="submit"
          color="primary"
          :loading="loading"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Sprint, SprintCreate, SprintUpdate } from 'src/types/models.types';

// ============================================
// Props
// ============================================

interface Props {
  sprint?: Sprint | null;
  loading?: boolean;
  projectOptions?: { label: string; value: number }[];
}

const props = withDefaults(defineProps<Props>(), {
  sprint: null,
  loading: false,
  projectOptions: () => [],
});

// ============================================
// Emits
// ============================================

const emit = defineEmits<{
  submit: [data: SprintCreate | SprintUpdate];
  cancel: [];
}>();

// ============================================
// State
// ============================================

const isEdit = ref(!!props.sprint);

const formData = ref<SprintCreate>({
  name: '',
  project_id: 0,
  goal: '',
  start_date: '',
  end_date: '',
});

// ============================================
// Watch
// ============================================

watch(
  () => props.sprint,
  (sprint) => {
    if (sprint) {
      isEdit.value = true;
      formData.value = {
        name: sprint.name,
        project_id: sprint.project_id,
        goal: sprint.goal || '',
        start_date: sprint.start_date || '',
        end_date: sprint.end_date || '',
      };
    }
  },
  { immediate: true }
);

// ============================================
// Methods
// ============================================

function handleSubmit() {
  emit('submit', formData.value);
}

function handleCancel() {
  emit('cancel');
}
</script>
