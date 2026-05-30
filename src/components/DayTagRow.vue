<script setup lang="ts">
import { FdBadge } from '@fulldroper/ui-kit'

const props = defineProps<{
  dateOptions: string[]
  selectedDays: string[]
  disabledDays?: string[]
}>()

const emit = defineEmits<{
  (event: 'toggle-day', day: string): void
}>()

const isActive = (day: string) => props.selectedDays.includes(day)
const isDisabled = (day: string) => props.disabledDays?.includes(day) ?? false

const formatWeekday = (day: string) => {
  const d = new Date(`${day}T12:00:00`)
  const weekday = d.toLocaleDateString('uk-UA', { weekday: 'long' })
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}
</script>

<template>
  <div class="day-tag-row">
    <button
      v-for="day in dateOptions"
      :key="day"
      type="button"
      class="day-tag"
      :class="{ active: isActive(day), disabled: isDisabled(day) }"
      :disabled="isDisabled(day)"
      @click="emit('toggle-day', day)"
    >
      <FdBadge :tone="isDisabled(day) ? 'muted' : isActive(day) ? 'success' : 'muted'">
        {{ formatWeekday(day) }}
      </FdBadge>
    </button>
  </div>
</template>

<style scoped>
.day-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.day-tag {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.day-tag.active :deep(.fd-badge) {
  background: hsl(var(--fd-accent) / 0.16);
  border-color: hsl(var(--fd-accent));
}

.day-tag.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.day-tag.disabled :deep(.fd-badge) {
  color: hsl(var(--fd-muted));
}
</style>
