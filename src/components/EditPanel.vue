<script setup lang="ts">
import { FdButton, FdInput, FdPanel } from '@fulldroper/ui-kit'

const props = defineProps<{
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
  <section>
    <FdPanel title="Редагування голосу" subtitle="Оновіть власний голос через edit token">
      <div class="form-grid compact-grid">
        <FdInput
          :model-value="editToken"
          @update:modelValue="(value: string) => emit('update:editToken', String(value))"
          label="Edit token"
          placeholder="demo-1"
        />
        <FdButton @click="emit('load-edit-vote')">Завантажити голос</FdButton>
      </div>

      <div v-if="hasEditableVote" class="edit-preview">
        <p><strong>Поточний голос:</strong> {{ props.editToken }}</p>
        <div class="action-row">
          <FdButton @click="emit('update-vote')">Зберегти зміни</FdButton>
        </div>
      </div>
    </FdPanel>
  </section>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.compact-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.edit-preview {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 18px;
  background: hsl(var(--fd-surface-2));
  border: 1px dashed hsl(var(--fd-border));
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}
</style>
