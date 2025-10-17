<template>
  <div class="team-member-list">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col">
        <div class="text-h6">Team Members</div>
        <div class="text-caption text-grey-7">
          {{ members.length }} member(s)
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          v-if="canAddMember"
          color="primary"
          label="Add Member"
          icon="person_add"
          @click="handleAddMember"
        />
      </div>
    </div>

    <!-- Member List -->
    <q-list bordered separator v-if="members.length > 0">
      <q-item v-for="member in members" :key="member.id">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <q-icon name="person" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>User #{{ member.user_id }}</q-item-label>
          <q-item-label caption>
            <status-badge type="team-role" :value="member.role" size="sm" />
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row q-gutter-xs">
            <q-btn
              v-if="canEditRole"
              flat
              dense
              round
              icon="swap_horiz"
              color="primary"
              @click="handleChangeRole(member)"
            >
              <q-tooltip>Change Role</q-tooltip>
            </q-btn>
            <q-btn
              v-if="canRemoveMember"
              flat
              dense
              round
              icon="person_remove"
              color="negative"
              @click="handleRemoveMember(member)"
            >
              <q-tooltip>Remove from Team</q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Empty State -->
    <empty-state
      v-else
      icon="people"
      title="No team members"
      description="Add members to start collaborating"
    >
      <q-btn
        v-if="canAddMember"
        color="primary"
        label="Add Member"
        @click="handleAddMember"
      />
    </empty-state>
  </div>
</template>

<script setup lang="ts">
import type { TeamMember } from 'src/types/models.types';
import StatusBadge from 'src/components/common/StatusBadge.vue';
import EmptyState from 'src/components/common/EmptyState.vue';

// ============================================
// Props
// ============================================

interface Props {
  members: TeamMember[];
  canAddMember?: boolean;
  canEditRole?: boolean;
  canRemoveMember?: boolean;
}

withDefaults(defineProps<Props>(), {
  canAddMember: false,
  canEditRole: false,
  canRemoveMember: false,
});

// ============================================
// Emits
// ============================================

const emit = defineEmits<{
  addMember: [];
  changeRole: [member: TeamMember];
  removeMember: [member: TeamMember];
}>();

// ============================================
// Methods
// ============================================

function handleAddMember() {
  emit('addMember');
}

function handleChangeRole(member: TeamMember) {
  emit('changeRole', member);
}

function handleRemoveMember(member: TeamMember) {
  emit('removeMember', member);
}
</script>
