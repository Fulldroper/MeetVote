<script setup lang="ts">
import EditPanel from '../components/EditPanel.vue'

defineProps<{
  editToken: string
  hasEditableVote: boolean
}>()

const emit = defineEmits<{
  (event: 'update:editToken', value: string): void
  (event: 'load-edit-vote'): void
  (event: 'update-vote'): void
}>()
</script>

<template>
  <EditPanel
    :editToken="editToken"
    :hasEditableVote="hasEditableVote"
    @update:editToken="emit('update:editToken', $event)"
    @load-edit-vote="emit('load-edit-vote')"
    @update-vote="emit('update-vote')"
  />
</template>
