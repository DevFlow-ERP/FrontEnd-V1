<template>
  <q-form @submit="handleSubmit" class="team-form">
    <!-- Team Name -->
    <q-input
      v-model="formData.name"
      label="Team Name *"
      :rules="[(val) => !!val || 'Team name is required']"
      outlined
      class="q-mb-md"
    />

    <!-- Description -->
    <q-input
      v-model="formData.description"
      label="Description"
      type="textarea"
      rows="4"
      outlined
      class="q-mb-md"
    />

    <!-- Active Status -->
    <q-toggle
      v-model="formData.is_active"
      label="Active Team"
      color="positive"
      class="q-mb-md"
    />

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
import type { Team, TeamCreate, TeamUpdate } from 'src/types/models.types';

// ============================================
// Props
// ============================================

interface Props {
  team?: Team | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  team: null,
  loading: false,
});

// ============================================
// Emits
// ============================================

const emit = defineEmits<{
  submit: [data: TeamCreate | TeamUpdate];
  cancel: [];
}>();

// ============================================
// State
// ============================================

const isEdit = ref(!!props.team);

const formData = ref<TeamCreate>({
  name: '',
  is_active: true,
});

// ============================================
// Watch
// ============================================

watch(
  () => props.team,
  (team) => {
    if (team) {
      isEdit.value = true;
      const data: TeamCreate = {
        name: team.name,
        is_active: team.is_active,
      };

      if (team.description) data.description = team.description;

      formData.value = data;
    }
  },
  { immediate: true }
);

// ============================================
// Methods
// ============================================

function handleSubmit() {
  // Clean up empty values
  const submitData = { ...formData.value };

  if (!submitData.description) {
    delete submitData.description;
  }

  emit('submit', submitData);
}

function handleCancel() {
  emit('cancel');
}
</script>
